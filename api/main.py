from fastapi import FastAPI
from api.utils.mudah import mudahRouter
from api.utils.zigwheels import informationRouter

from fastapi.middleware.cors import CORSMiddleware

VERSION = "0.1.1"

app = FastAPI(debug=True, version=VERSION, title=f"Vehicle Valuation API | v{VERSION}", root_path='/api')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(mudahRouter)
app.include_router(informationRouter)

print("Started API")