const request = require('supertest');
const app = require('../server') ;
const { default: mongoose } = require('mongoose');

describe('PUT /api/follow' , async () => {
   it('Should create new follower relationship' , async () => {
    const response = await request(app).put('/api/follow').send({
        followerId:new mongoose.Types.ObjectId() , 
        followeeId: new mongoose.Types.ObjectId()
    })

    expect(response.statusCode).toBe(200);
   })

})