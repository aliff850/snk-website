from fastapi import FastAPI
from api.utils.mudah import mudahRouter
from api.utils.zigwheels import informationRouter

VERSION = "0.1.1"

app = FastAPI(debug=True, version=VERSION, title=f"Vehicle Valuation API | v{VERSION}")
app.include_router(mudahRouter)
app.include_router(informationRouter)