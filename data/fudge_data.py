from google import genai


# The client gets the API key from the environment variable `GEMINI_API_KEY`.
client = genai.Client(api_key="replace_with_your_api_key")

response = client.models.generate_content(
    model="gemini-2.5-flash", contents="""
      Generate 100 rows of fudge data in CSV format.
      Columns: Date, Emotion 1, Emotion 2, Emotion 3.
      Dates should start from 2024-01-01 and increase by 1 day each row.
      Emotions can be chosen from: Happy, Joyful, Excited, Content, Hopeful, 
      Grateful, Proud, Confident, Loving, Playful, Calm, Relaxed, Peaceful, 
      Curious, Thoughtful, Nostalgic, Focused, Interested, Reflective, Surprised, 
      Sad, Lonely, Hurt, Angry, Frustrated, Anxious, Nervous, Insecure, 
      Overwhelmed, Jealous, Confused, Awkward, Embarrassed, Guilty, Ashamed, 
      Regretful, Resentful, Envious, Determined, Motivated.
      Make sure each row has 3 different emotions.
      """
)
print(response.text)
