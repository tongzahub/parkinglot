
## Pracking Lot API Service

API | Method | Description | Example Params
------------ | ------------- | ------------- | -------------
/parking/status | GET | Provide current Status of   Parking lot  | {" packingId" : "xxxx"}
/parking/numberPlateInSlot | GET | get registration plate number list by car size | {"slotType" : "
S", packingId : "xxxx"}
/parking/crete | POST | Create parking lot | {"S" : 10 , "M":10 , "L"}
/parking/checkin | POST | Park the car on Slot  | { "slotId" : "xxxx"}
/parking/leave | POST | Leave the slot   | { "slotId" :"xxx","packingId":"xxx","slotType":"xxxxx"}
/parking/allocatedByCarSize | POST | Park the car on Slot  | { "slotType" :"xxx","packingId":"xxx","numberPlate":"xxxxx","carSize":"S"}
/parking/checkin | POST | Park the car on Slot  | { "slotId" : "xxxx"}



## Ticket API Service

API | Method | Description | Example Params
------------ | ------------- | ------------- | -------------
/ticket | POST | Create Ticket |{"numberPlate" :"xx", "carSize":"S"}
/ticket/report-daily | GET | list  daily ticket  |{"date" :"xx", "packingId":"S"}