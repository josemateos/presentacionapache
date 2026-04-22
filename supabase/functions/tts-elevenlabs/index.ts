// tts-elevenlabs v2
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

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

    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "ELEVENLABS_API_KEY not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Default voice: Sarah (clear, natural English female)
    const voice = voiceId || "EXAVITQu4vr4xnSDxMaL";

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
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true,
            speed: 0.95,
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
    const audioContent = base64Encode(new Uint8Array(audioBuffer));

    return new Response(
      JSON.stringify({ audioContent }),
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
