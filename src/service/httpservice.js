import axios from 'axios'

export default axios.create({
 baseURL: `https://esrabackend-env.eba-mg4caqyt.us-east-1.elasticbeanstalk.com/`,
 headers: {
 'Accept': 'application/json',
 'Content-Type': 'application/json',
 //'Authorization':`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkFzYWRAZXNyYS5jb20iLCJ1aWQiOiJ0cmFja2NvdmlkX2E1ajFnc3l1NWQ4NnU0dHlhbG95dXk0IiwiaXNzIjoiVHJhY2tDb3ZpZF9Qb3J0YWwiLCJzdWIiOiJ0ZXN0dXNlckBsYW1iZGF6ZW4uY29tIiwidmVyIjoiMS4wIiwiaWF0IjoxNjA1NzY1NTg0LCJleHAiOjE2MDU3NjkxODR9.F98It_xBV-5FLVZScxxqqncBFVz1unJLMOy1jIaMG60`
 }
 })
