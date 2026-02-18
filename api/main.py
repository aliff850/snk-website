from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from api.utils.mudah.router import mudahRouter
from api.utils.zigwheels.router import informationRouter
from api.utils.carlist.router import carlistRouter
from api.utils.insurable.router import insurableRouter

from fastapi.middleware.cors import CORSMiddleware

VERSION = "0.1.1"

app = FastAPI(debug=True, version=VERSION, title=f"Vehicle Valuation API | v{VERSION}", root_path='/api')
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://snkmarketdata.com/", "https://snkmdr-dev.vercel.app/", "http://localhost:3000/"],  # Adjust this to your Vercel URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Custom handler for Pydantic validation errors.
    Returns error message in 'meta' field as JSON response.
    """
    # Extract error messages from validation errors
    error_msg = exc.errors() or "Validation error occurred"
    
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={"meta": str(error_msg)}
    )

app.include_router(mudahRouter)
app.include_router(informationRouter)
app.include_router(carlistRouter)
app.include_router(insurableRouter)

print("Started API")