from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from api.utils.mudah.mudah_router import mudahRouter
from api.utils.zigwheels.router import informationRouter
from api.utils.carlist.carlist_router import carlistRouter
from api.utils.insurable.router import insurableRouter
from api.utils.valuation.valuation_router import valuationRouter


from api.utils.admin.admin_router import router as adminRouter

from fastapi.middleware.cors import CORSMiddleware

VERSION = "0.1.1"

app = FastAPI(debug=True, version=VERSION, title=f"Vehicle Valuation API | v{VERSION}", root_path='/api')

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://snkmarketdata.com", 
        "https://snkmdr-dev.vercel.app", 
        "http://localhost:3000",   # 🔴 Removed trailing slash
        "http://127.0.0.1:3000"    # 🔴 Added secondary local IP
    ],  
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
app.include_router(valuationRouter)


app.include_router(adminRouter)

print("Started API")