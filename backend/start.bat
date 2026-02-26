@echo off
echo Starting SecurePass FastAPI Backend...
echo.

REM Activate virtual environment
call fastapi_env\Scripts\activate

REM Start the FastAPI server
uvicorn app:app --reload

pause
