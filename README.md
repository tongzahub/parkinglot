### Problem Statement 

I own a parking lot that can hold up to ‘n’ cars at any given point in time. I want to create an automated ticketing system that allows my customers to use my parking lot without human intervention. 
When a car enters my parking lot, I want to have a ticket issued to the driver. The ticket information contains the registration number (number plate) and the car size and allocated parking slot (we assume that our customers are nice enough to always park in the slots allocated to them). The customer should be allocated a parking slot which is nearest to the entry. At the exit the customer returns the ticket which then marks the slot they were using as being available. 


<!-- ABOUT THE PROJECT -->
## Ideas Packing Lot

![packinglot-1] 

![packinglot-2] 


## Mongodb Schema 

![packinglot-packingprofile] 

![packinglot-packingmanagement]

![packinglot-ticket] 

## Deployment
```
cd mongodb 
docker-compose up -d

```

## Service Expose port
- packing lot : 4002
- ticket : 4002

## Pracking Lot API Service


API | Method | Description | Example Params
------------ | ------------- | ------------- | -------------
/parking/status | GET | Provide current Status of   Parking lot  | {" packingId" : "xxxx"}
/parking/numberPlateInSlot | GET | get registration plate number list by car size | {"carSize" : "S", packingId : "xxxx"}
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



## Improve Plan
- add event-bus service
- update test script
- deploy on k8s


## Migration to aws (Serverless)
- Change MongoDB (Docker) To AWS Dynamodb
- Change Service (Docker)  To AWS Lanmbda and AWS APIGateway

<!-- MARKDOWN LINKS & IMAGES -->
[packinglot-1]: images/packinglot-1.png
[packinglot-2]: images/packinglot-2.png
[packinglot-packingmanagement]: images/packinglot-packingmanagement.png
[packinglot-packingprofile]: images/packinglot-packingmanagement.png
[packinglot-ticket]: images/packinglot-ticket.png
