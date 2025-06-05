from fastapi import FastAPI
from enum import Enum
app=FastAPI()
# @app.get('/hello/{name}')
# async def hello(name):
#     return  f"welcome to the fast api {name}"

# '''
# get is used to read the data ,it reads all the data which user acutally want like if user gets to show all this iphone cover
# and post method is used to create new order  or create data 
# put method is used to update the data ex update an order by replcaing size from s to l etc
# delete is used to delete an data or delete an order
# '''
class AvailableCusines(str,Enum):
    indian='indian'
    american="american"
food_items={
    'indian':["samosa","idly"],
    'american':["burger","pizza"]
}
valid_cusines =food_items.keys()
@app.get('/getitem/{cusine}')
async def getitem(cusine:AvailableCusines):
    # if cusine not in valid_cusines:
    #     return f"Supported cusines are {valid_cusines}"
    return food_items.get(cusine)