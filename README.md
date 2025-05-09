# Hilton-Reservation

A full-stack hotel reservation management system built with modern web technologies. This application allows guests to make table reservations and hotel staff to manage these reservations efficiently.

## Tech Stack

### Backend

- NestJS : A progressive Node.js framework for building efficient and scalable server-side applications

- MongoDB : NoSQL database used for storing reservation and user data

- Mongoose : ODM (Object Data Modeling) library for MongoDB and Node.js

- GraphQL : API query language that provides a more efficient, powerful and flexible alternative to REST

- JWT Authentication : Secure authentication mechanism for protecting API endpoints

### Frontend

- SolidJS : A declarative, efficient, and flexible JavaScript library for building user interfaces

- Suid: Material like UI Framework for SolidJS

### DevOps

- Docker : Containerization for consistent development and deployment environments

- Docker Compose : For orchestrating multi-container Docker applications

- AWS ECR : For storing Docker images

- AWS EC2 : For hosting the application
                                                                  
![image](https://github.com/user-attachments/assets/bc8eec83-b16e-4878-8250-5e345d87af2b)


---------------------------------------------------------------------------------------------


## Project Structure

![image](https://github.com/user-attachments/assets/26d62005-8b88-48fa-b48b-6962385ab796)



# The Reason for organizing the project structure:
1. NestJS backend and SolidJS frontend are separated to make it easier to maintain and scale
2. The backend and frontend is under the same root directory to make it easier to work with docker compose
3. The backend has basically followed the best practices of NestJS
4. The frontend folder structure is similar to the React folder structure for easy understanding

---------------------------------------------------------------------------------------------------------------

## Deployment Instructions
### Prerequisites
- Docker and Docker Compose installed
- AWS account with ECR repository created
- MongoDB database (Atlas or self-hosted)

### Local Development
1. Clone the repository:
```
git clone https://github.com/jianzheGuo/Hilton-Reservation.git
cd Hilton-Reservation
```
2. Create a .env file in the root directory with the following variables:
```
PORT=8080
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/hilton_reservation
JWT_SECRET=your_jwt_secret_here
```
3. Start the development environment:
```
docker-compose up --build
```


## Production Deployment
1. Build and push Docker images to ECR:
```
# Login to ECR
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.ap-northeast-1.amazonaws.com

# Build and push images
docker-compose build
docker push <aws_account_id>.dkr.ecr.ap-northeast-1.amazonaws.com/hilton/hilton-reservatopm:backend
docker push <aws_account_id>.dkr.ecr.ap-northeast-1.amazonaws.com/hilton/hilton-reservatopm:frontend
```
2. On your EC2 instance, create a docker-compose.yml file:
```
 services:
  frontend:
    image: <aws_account_id>.dkr.ecr.ap-northeast-1.amazonaws.com/hilton/hilton-reservatopm:frontend
    ports:
      - "80:80"

  backend:
    image: <aws_account_id>.dkr.ecr.ap-northeast-1.amazonaws.com/hilton/hilton-reservatopm:backend
    env_file:
      - .env
    ports:
      - "8080:8080"
    environment:
      - NODE_ENV=production
      - MONGO_URI=${MONGO_URI}
      - JWT_SECRET=${JWT_SECRET}
```
3. Create the .env file with production credentials
4. Login to ECR on EC2 and pull the images:
```
aws ecr get-login-password --region ap-northeast-1 | docker login --username AWS --password-stdin <aws_account_id>.dkr.ecr.ap-northeast-1.amazonaws.com
```
5. Start the containers:
```
docker-compose up -d
```
