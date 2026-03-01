@echo off
echo Starting SecurePass FastAPI Backend (SQLAlchemy)...
echo.

REM Activate virtual environment
call fastapi_env\Scripts\activate

REM Start FastAPI server
python -m uvicorn app:app --reload --host 0.0.0.0 --port 8000

pause
