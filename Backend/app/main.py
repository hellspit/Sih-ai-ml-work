"""
Main FastAPI application for Air Pollution Forecasting API
"""

import warnings
import os
# Suppress numpy warnings on Windows (MINGW-W64 build warnings)
warnings.filterwarnings('ignore', category=RuntimeWarning)
os.environ['PYTHONWARNINGS'] = 'ignore::RuntimeWarning'

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
from contextlib import asynccontextmanager

from app.api import predict, health
from app.core.logging_config import setup_logging

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown events"""
    # Startup
    logger.info("Starting Air Pollution Forecasting API...")
    logger.info("Loading models...")
    
    try:
        from app.models.loader import get_model_loader
        model_loader = get_model_loader()
        
        # Pre-load all models (optional, for faster first request)
        # Models will be loaded on-demand if this fails
        logger.info("Pre-loading models (optional - will load on-demand if skipped)...")
        loaded_count = 0
        for site_id in range(1, 8):
            try:
                model_loader.load_models(site_id)
                loaded_count += 1
                logger.info(f"Loaded model for site {site_id}")
            except Exception as e:
                logger.warning(f"Could not pre-load model for site {site_id}: {e}. Will load on-demand.")
        
        # Load unified model
        try:
            model_loader.load_models(None)
            loaded_count += 1
            logger.info("Loaded unified model")
        except Exception as e:
            logger.warning(f"Could not pre-load unified model: {e}. Will load on-demand.")
        
        if loaded_count > 0:
            logger.info(f"Successfully pre-loaded {loaded_count} model(s)")
        else:
            logger.info("Models will be loaded on-demand when first request is made")
    except Exception as e:
        logger.error(f"Error loading models during startup: {e}")
    
    yield
    
    # Shutdown
    logger.info("Shutting down Air Pollution Forecasting API...")


# Create FastAPI app
app = FastAPI(
    title="Air Pollution Forecasting API",
    description="AI/ML-based advanced model for short-term forecast (24-48 hours) of surface O3 and NO2 for Delhi",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(predict.router)
app.include_router(health.router)


@app.get("/", tags=["root"])
async def root():
    """Root endpoint"""
    return {
        "message": "Air Pollution Forecasting API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/api/v1/health"
    }


@app.exception_handler(Exception)
async def global_exception_handler(request, exc):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal server error",
            "details": str(exc) if logger.level == logging.DEBUG else "An unexpected error occurred"
        }
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


