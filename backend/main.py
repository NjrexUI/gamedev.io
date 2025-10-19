from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx, asyncio, os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GenerateRequest(BaseModel):
    prompt: str
    resolution: str
    style: str
    make_it_tile: bool

completed_jobs = {}

async def poll_job_set(job_set_id: str, headers: dict, max_wait: int = 30) -> str:
    """
    Polls the job-set until status is 'completed' and returns the raw image URL.
    Raises HTTPException if job fails or times out.
    """
    async with httpx.AsyncClient() as client:
        for _ in range(max_wait):
            res = await client.get(f"https://platform.higgsfield.ai/v1/job-sets/{job_set_id}", headers=headers)
            res.raise_for_status()
            data = res.json()
            jobs = data.get("jobs", [])

            if not jobs:
                await asyncio.sleep(1)
                continue

            job = jobs[0]  
            status = job.get("status")
            
            print(f"Polling job: {job.get('id')} status={status}")

            if status == "completed":
                results = job.get("results", {})
                image_url = results.get("raw", {}).get("url")
                if image_url:
                    return image_url
                else:
                    raise HTTPException(status_code=500, detail="Job completed but no image URL found")

            elif status == "failed":
                raise HTTPException(status_code=500, detail="Higgsfield job failed")

            await asyncio.sleep(1)

    raise HTTPException(status_code=408, detail="Job did not complete in time")

@app.post("/api/generate-textures/")
async def generate_textures(data: GenerateRequest):
    api_key = os.getenv("HF_API_KEY")
    secret = os.getenv("HF_SECRET")

    headers = {
        "Content-Type": "application/json",
        "hf-api-key": api_key,
        "hf-secret": secret,
    }

    final_prompt = "A VIDEO GAME TEXTURE." + data.prompt + ". TEXTURE STYLE: " + data.style
    
    if data.make_it_tile:
        final_prompt += ". MAKE TEXTURE SEAMPLESS"
        
    payload = {
        "params": {
            "prompt": final_prompt,
            "width_and_height": "1536x1536",
            "enhance_prompt": False,
            "style_id": "464ea177-8d40-4940-8d9d-b438bab269c7",
            "style_strength": 1,
            "quality": data.resolution,
            "seed": 500000,
            "custom_reference_id": None,
            "custom_reference_strength": 1,
            "image_reference": None,
            "batch_size": 1,
            "input_images": [], 
            "aspect_ratio": "1:1"
        }
    }

    async with httpx.AsyncClient() as client:
        create_res = await client.post(
            "https://platform.higgsfield.ai/v1/text2image/nano-banana",
            headers=headers,
            json=payload,
            timeout=30
        )

        if create_res.status_code != 200:
            raise HTTPException(status_code=create_res.status_code, detail=create_res.text)

        job_set_data = create_res.json()
        job_set_id = job_set_data.get("id")
        if not job_set_id:
            raise HTTPException(status_code=500, detail="No job-set ID returned from Higgsfield")

    image_url = await poll_job_set(job_set_id, headers, max_wait=30)

    return {"url": image_url}
