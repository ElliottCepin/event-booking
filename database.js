var {MongoClient, ObjectId} = require('mongodb')
var client = new MongoClient('mongodb://127.0.0.1:27017/')


/*
 * I was thinking if we are doing the multiple types of registration, we can just 
 * search listings and reservations based on the username
 */

async function mongoConnect(){
    try{
        await client.connect()
        console.log('Connected to mongoDB.')
        await client.close()
    }
    catch(err){
        console.log(err)
    }
}

async function createUser(user){
// Since we are abandoning the multiple types of registration, I will only be checking for
// unique usernames and gmails when signing up, not combinations.
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('users');

        await coll.createIndex({ email: 1 }, { unique: true });

        user._id = user.username;
        await coll.insertOne(user);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function findUser(user){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('users');
        var result = await coll.find(user).toArray();
        await client.close();
        return result;
    }
    catch(err){
        console.log(err);
    }
}

async function deleteUser(user){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('users');
        await coll.deleteOne(user);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}




async function createTicket(ticket){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('tickets');
        await coll.insertOne(ticket);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function createTickets(tickets){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('tickets');
        await coll.insertMany(tickets);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function findTicketByReservation(reservationId){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('tickets');
        var result = await coll.find(reservationId).toArray();
        await client.close();
        return result;
    }
    catch(err){
        console.log(err);
    }
}

async function findTicketById(id){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('tickets');
        var result = await coll.find(id).toArray();
        await client.close();
        return result;
    }
    catch(err){
        console.log(err);
    }
}

async function deleteTicket(id){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('tickets');
        await coll.deleteOne(id);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function deleteTicketByReservationId(reservationId){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('tickets');
        await coll.deleteUsers(reservationId);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}


async function createReservartion(reservation){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('reservations');
        await coll.insertOne(reservation);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function findReservartion(reservation){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('reservations');
        var result = await coll.find(reservation).toArray();
        await client.close();
        return result;
    }
    catch(err){
        console.log(err);
    }
}

async function deleteReservation(reservation){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('reservation');

        await deleteTicketByReservationId(reservation);

        await coll.deleteOne(reservation);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function deleteReservationByListingId(listing){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('reservation');

        var reservation = await findReservartion(listing);

        await deleteTicketByReservationId(reservation);

        await coll.deleteOne(reservation);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function createListing(listing){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('listing');
        await coll.insertOne(listing);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function findListing(listing){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('listing');
        var result = await coll.find(listing).toArray();
        await client.close();
        return result;
    }
    catch(err){
        console.log(err);
    }
}

async function deleteListing(listing){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('listing');
        var result = await coll.find(listing).toArray();
        await client.close();
        return result;
    }
    catch(err){
        console.log(err);
    }
}

async function deleteListing(listing){
    try{
        await client.connect();
        var db = client.db('bookingDB');
        var coll = db.collection('reservation');

        await deleteReservationByListingId(listing);

        await coll.deleteOne(listing);
        await client.close();
    }
    catch(err){
        console.log(err);
    }
}

async function update(collName, search, changes){
    await client.connect();
    var db = client.db('bookingDB');
    var coll = db.collection(collName);
    await coll.updateOne(search, changes);
    await client.close();
}   