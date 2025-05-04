from fastapi import APIRouter

router = APIRouter()

@router.get("/get-all-users")
def get_all_users():
    return {"status": "Success", "data": [], "message": "Get all users successfully"}

@router.get("/get-user/{user_id}")
def get_user(user_id: int):
    return {"status": "Success", "data": {}, "message": f"Get user with ID {user_id} successfully"}

@router.post("/create-user")
def create_user(user: dict):
    return {"status": "Success", "data": {}, "message": "User created successfully !"}