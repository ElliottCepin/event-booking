var { MongoClient, ObjectId } = require("mongodb");

async function getClient() {
  const client = new MongoClient("mongodb://127.0.0.1:27017/");
  await client.connect();
  return client;
}

async function createUser(user) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("users");

    await coll.createIndex({ email: 1 }, { unique: true }).catch(() => {});

    user._id = user.username;

    await coll.insertOne(user);
    await client.close();
    return true;
  } catch (err) {
    console.log("createUser ERROR:", err);
    return false;
  }
}

async function findUser(query) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("users");

    const result = await coll.find(query).toArray();
    await client.close();
    return result;
  } catch (err) {
    console.log("findUser ERROR:", err);
    return [];
  }
}

async function updateUser(user){
    try{
        const client = await getClient();
        var db = client.db('bookingDB');
        var coll = db.collection('users');
        await coll.replaceOne({"_id": user._id}, user, {upsert: true});
        await client.close();
    }
    catch(err){
        console.log(err);
	}
}

async function deleteUser(query) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("users");

    await coll.deleteOne(query);
    await client.close();
    return true;
  } catch (err) {
    console.log("deleteUser ERROR:", err);
    return false;
  }
}

async function createTicket(ticket) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("tickets");

    await coll.insertOne(ticket);
    await client.close();
    return true;
  } catch (err) {
    console.log("createTicket ERROR:", err);
    return false;
  }
}

async function createTickets(tickets) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("tickets");

    await coll.insertMany(tickets);
    await client.close();
    return true;
  } catch (err) {
    console.log("createTickets ERROR:", err);
    return false;
  }
}

async function findTicketByReservation(reservationQuery) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("tickets");

    const result = await coll.find(reservationQuery).toArray();
    await client.close();
    return result;
  } catch (err) {
    console.log("findTicketByReservation ERROR:", err);
    return [];
  }
}

async function findTicketById(query) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("tickets");

    const result = await coll.find(query).toArray();
    await client.close();
    return result;
  } catch (err) {
    console.log("findTicketById ERROR:", err);
    return [];
  }
}

async function deleteTicket(query) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("tickets");

    await coll.deleteOne(query);
    await client.close();
    return true;
  } catch (err) {
    console.log("deleteTicket ERROR:", err);
    return false;
  }
}

async function deleteTicketByReservationId(reservationQuery) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("tickets");

    await coll.deleteMany(reservationQuery);
    await client.close();
    return true;
  } catch (err) {
    console.log("deleteTicketByReservationId ERROR:", err);
    return false;
  }
}

async function createReservation(reservation) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("reservations");

    await coll.insertOne(reservation);
    await client.close();
    return true;
  } catch (err) {
    console.log("createReservation ERROR:", err);
    return false;
  }
}

async function findReservation(query) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("reservations");

    const result = await coll.find(query).toArray();
    await client.close();
    return result;
  } catch (err) {
    console.log("findReservation ERROR:", err);
    return [];
  }
}

async function deleteReservation(reservation) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("reservations");

    await deleteTicketByReservationId({ reservationId: reservation.uniqueId });

    await coll.deleteOne({ _id: reservation._id });
    await client.close();
    return true;
  } catch (err) {
    console.log("deleteReservation ERROR:", err);
    return false;
  }
}

async function deleteReservationByListingId(listingQuery) {
  try {
    const reservations = await findReservation(listingQuery);
    const reservation = reservations[0];
    if (!reservation) return false;

    await deleteTicketByReservationId({ reservationId: reservation.uniqueId });

    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("reservations");

    await coll.deleteOne({ _id: reservation._id });
    await client.close();
    return true;
  } catch (err) {
    console.log("deleteReservationByListingId ERROR:", err);
    return false;
  }
}

async function createListing(listing) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("listing");

    await coll.insertOne(listing);
    await client.close();
    return true;
  } catch (err) {
    console.log("createListing ERROR:", err);
    return false;
  }
}

async function findListing(query) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("listing");

    const result = await coll.find(query).toArray();
    await client.close();
    return result;
  } catch (err) {
    console.log("findListing ERROR:", err);
    return [];
  }
}

async function deleteListing(listingQuery) {
  try {
    await deleteReservationByListingId(listingQuery);

    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection("listing");

    await coll.deleteOne(listingQuery);
    await client.close();
    return true;
  } catch (err) {
    console.log("deleteListing ERROR:", err);
    return false;
  }
}

async function update(collName, search, changes) {
  try {
    const client = await getClient();
    const db = client.db("bookingDB");
    const coll = db.collection(collName);

    await coll.updateOne(search, changes);
    await client.close();
    return true;
  } catch (err) {
    console.log("update ERROR:", err);
    return false;
  }
}

async function getAllListings() {
    try {
        client = await getClient(); 
        var db = client.db('bookingDB');
        var coll = db.collection('listing'); // same name you used in createListing
        var result = await coll.find({}).toArray();
        await client.close();
        return result;
    }
    catch(err){
        console.log(err);
    }
}
module.exports = {
    createUser,
    findUser,
    deleteUser,
	updateUser,
    createTicket,
    createTickets,
    findTicketByReservation,
    findTicketById,
    deleteTicket,
    deleteTicketByReservationId,
    createReservation,
    findReservation,
    deleteReservation,
    deleteReservationByListingId,
    createListing,
    findListing,
    deleteListing,
    update,
    getAllListings
};
