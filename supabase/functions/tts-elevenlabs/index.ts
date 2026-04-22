// tts-elevenlabs v3 - with persistent storage cache
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "tts-cache";

function slugify(text: string, voice: string): string {
  const clean = text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .slice(0, 60);
  return `${voice}/${clean || "audio"}.mp3`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceId } = await req.json();

    if (!text || typeof text !== "string" || text.length > 500) {
      return new Response(
        JSON.stringify({ error: "Invalid text" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Default voice: Brian (clear American English male, excellent diction)
    const voice = voiceId || "nPczCjzI2devNBz1zQrb";
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const filePath = slugify(text, voice);
    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;

    // 1) Check cache via HEAD
    try {
      const head = await fetch(publicUrl, { method: "HEAD" });
      if (head.ok) {
        return new Response(
          JSON.stringify({ audioUrl: publicUrl, cached: true }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } },
        );
      }
    } catch (_) {
      // ignore, will generate
    }

    // 2) Generate via ElevenLabs
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_turbo_v2_5",
          voice_settings: {
            stability: 0.75,
            similarity_boost: 0.85,
            style: 0.0,
            use_speaker_boost: true,
            speed: 0.9,
          },
        }),
      },
    );

    if (!ttsResponse.ok) {
      const errText = await ttsResponse.text();
      console.error("ElevenLabs error:", ttsResponse.status, errText);
      return new Response(
        JSON.stringify({ error: "TTS failed", detail: errText }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const audioBuffer = await ttsResponse.arrayBuffer();

    // 3) Upload to storage cache (best-effort)
    try {
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, audioBuffer, {
          contentType: "audio/mpeg",
          upsert: true,
        });
      if (uploadError) {
        console.error("Cache upload error:", uploadError);
      }
    } catch (e) {
      console.error("Cache upload exception:", e);
    }

    return new Response(
      JSON.stringify({ audioUrl: publicUrl, cached: false }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (error) {
    console.error("tts-elevenlabs error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
