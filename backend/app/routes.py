from flask import Blueprint, jsonify, request
from app.database import db
from app.models import User, Hotel, Room, Booking
import jwt
import datetime

routes = Blueprint("routes", __name__)

SECRET_KEY = "hotelmanagementproject328"  ## don't remove it this is the secreate key


def generate_token(user):
    payload = {
        "id": user.id,
        "username": user.username,
        "role": user.role,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1),
    }
    return jwt.encode(payload, SECRET_KEY, algorithm="HS256")


# Initialize the database
@routes.route("/api/init-db", methods=["GET"])
def initialize_database():
    try:
        db.create_all()
        return jsonify({"message": "Database initialized successfully!"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# User Signup
@routes.route("/api/signup", methods=["POST"])
def signup():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role", "user")

    if (
        User.query.filter_by(username=username).first()
        or User.query.filter_by(email=email).first()
    ):
        return jsonify({"message": "User already exists!"}), 400

    if role not in ["user", "admin"]:
        return jsonify({"message": "Invalid role!"}), 400

    user = User(username=username, email=email, role=role)
    user.set_password(password)

    db.session.add(user)
    db.session.commit()
    return (
        jsonify({"message": f"User '{username}' created successfully as '{role}'!"}),
        200,
    )


# User Login
@routes.route("/api/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    user = User.query.filter_by(username=username).first()
    if not user or not user.check_password(password):
        return jsonify({"message": "Invalid credentials"}), 401

    token = generate_token(user)
    return jsonify({"token": token, "role": user.role}), 200


# Get User Info
@routes.route("/api/user", methods=["GET"])
def get_user():
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])
        return (
            jsonify({"id": user.id, "username": user.username, "role": user.role}),
            200,
        )
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


@routes.route("/api/allusers", methods=["GET"])
def get_all_users():
    token = request.headers.get("Authorization")

    # Check if token is provided
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token

    try:
        # Decode the token
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])

        # Ensure the user has admin privileges
        if user.role != "admin":
            return jsonify({"message": "Access denied"}), 403

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

    try:
        # Fetch all users from the database
        users = User.query.all()

        # Serialize the user data
        users_data = [
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "role": user.role,
            }
            for user in users
        ]

        return (
            jsonify({"users": users_data, "message": "Users retrieved successfully"}),
            200,
        )

    except Exception as e:
        return jsonify({"message": "Failed to retrieve users", "error": str(e)}), 500


@routes.route("/api/user/<int:user_id>", methods=["PUT"])
def update_password(user_id):
    token = request.headers.get("Authorization")

    # Check if token is provided
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token

    try:
        # Decode the token
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])

        # Ensure the user has admin privileges
        if user.role != "admin":
            return jsonify({"message": "Access denied"}), 403

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

    # Find the user whose password needs to be updated
    user = User.query.get(user_id)

    if not user:
        return jsonify({"message": "User not found."}), 404

    try:
        data = request.json

        user.set_password(data.get("new_password"))

        # Commit the changes to the database
        db.session.commit()
        return (
            jsonify(
                {"message": f"Password updated successfully for user {user.email}."}
            ),
            200,
        )
    except Exception as e:
        db.session.rollback()
        print(e)
        return jsonify({"message": "Failed to update password.", "error": str(e)}), 500


@routes.route("/api/hotels/search", methods=["GET"])
def search_hotels():
    # Optionally handle token validation here if needed
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])

        # Get the city (location) parameter from the query string
        city = request.args.get("city", "").strip()  # Get city from query params

        # Optionally get a search term (like hotel name or any other field)
        search_term = request.args.get("search", "").strip()

        # Query hotels based on city and/or search term
        query = Hotel.query

        if city:
            query = query.filter(
                Hotel.city.ilike(f"%{city}%")
            )  # Case-insensitive match for city

        if search_term:
            query = query.filter(
                Hotel.name.ilike(f"%{search_term}%")
            )  # Case-insensitive match for name

        # Fetch filtered hotels
        hotels = query.all()

        # Serialize the hotel data to return it
        hotels_data = []
        for hotel in hotels:
            hotels_data.append(
                {
                    "id": hotel.id,
                    "name": hotel.name,
                    "city": hotel.city,
                    "capacity": hotel.capacity,
                    "peak_season_rate": hotel.peak_season_rate,
                    "off_peak_rate": hotel.off_peak_rate,
                }
            )

        return jsonify(hotels_data), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


@routes.route("/api/hotels", methods=["GET"])
def get_hotels():
    # Optionally handle token validation here if needed
    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])

        # Fetch all hotels from the database
        hotels = Hotel.query.all()

        # Serialize the hotel data to return it
        hotels_data = []
        for hotel in hotels:
            hotels_data.append(
                {
                    "id": hotel.id,
                    "name": hotel.name,
                    "city": hotel.city,
                    "capacity": hotel.capacity,
                    "peak_season_rate": hotel.peak_season_rate,
                    "off_peak_rate": hotel.off_peak_rate,
                }
            )

        return jsonify(hotels_data), 200

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401


@routes.route("/api/hotels/<int:hotel_id>/bookings", methods=["GET"])
def get_bookings_by_hotel(hotel_id):
    try:
        # Fetch all bookings for the given hotel ID by joining with Room and User models
        bookings = (
            db.session.query(Booking)
            .join(Room)
            .join(User)  # Join with User model to get the username
            .filter(Room.hotel_id == hotel_id)
            .all()
        )

        # Serialize the booking data
        bookings_data = [
            {
                "id": booking.id,
                "room_id": booking.room_id,
                "user_id": booking.user_id,
                "username": booking.user.username,  # Fetch the username from User model
                "booking_date": booking.booking_date,
                "status": booking.status,
                "room_type": booking.room.room_type,  # Assuming room_type is in Room model
            }
            for booking in bookings
        ]

        return jsonify(bookings_data), 200

    except Exception as e:
        return jsonify({"message": "Error fetching bookings", "error": str(e)}), 500


@routes.route("/api/hotel", methods=["POST"])
def add_hotel():

    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token

    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])

        # Check if the user has a valid role or permissions if necessary
        if user.role != "admin":  # Or any other condition you need
            return jsonify({"message": "Access denied"}), 403

    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

    # Get the hotel data from the request body
    data = request.get_json()

    # Validate the incoming data
    if (
        not data.get("name")
        or not data.get("city")
        or not data.get("capacity")
        or not data.get("peak_season_rate")
        or not data.get("off_peak_rate")
    ):
        return (
            jsonify({"message": "Missing required fields: name, city, capacity"}),
            400,
        )

    try:
        # Create a new hotel
        new_hotel = Hotel(
            name=data["name"],
            city=data["city"],
            capacity=data["capacity"],
            peak_season_rate=data["peak_season_rate"],
            off_peak_rate=data["off_peak_rate"],
        )

        # Add the hotel to the database
        db.session.add(new_hotel)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Hotel added successfully",
                    "hotel": {
                        "name": new_hotel.name,
                        "city": new_hotel.city,
                        "capacity": new_hotel.capacity,
                    },
                }
            ),
            201,
        )

    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "Failed to add hotel", "error": str(e)}), 500


# API to get all rooms
@routes.route("/api/rooms", methods=["GET"])
def get_rooms():
    try:
        hotel_id = request.args.get(
            "hotel_id", type=int
        )  # Get hotel_id from query parameters

        if hotel_id:
            # If hotel_id is provided, filter rooms by hotel_id
            rooms = Room.query.filter_by(hotel_id=hotel_id).all()
        else:
            # If hotel_id is not provided, return all rooms
            rooms = Room.query.all()

        result = []
        for room in rooms:
            result.append(
                {
                    "id": room.id,
                    "hotel_id": room.hotel_id,
                    "room_type": room.room_type,
                    "price": room.price,
                    "is_available": room.is_available,
                }
            )

        return jsonify(result), 200

    except Exception as e:
        print(e)
        return jsonify({"error": "Failed to fetch rooms."}), 500


# API to add a room
@routes.route("/api/rooms", methods=["POST"])
def add_room():
    data = request.get_json()
    hotel_id = data.get("hotel_id")
    room_type = data.get("room_type")
    price = data.get("price")
    is_available = data.get("is_available", True)

    if not hotel_id or not room_type or price is None:
        return jsonify({"error": "Missing required fields"}), 400

    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return jsonify({"error": "Hotel not found"}), 404

    new_room = Room(
        hotel_id=hotel_id, room_type=room_type, price=price, is_available=is_available
    )
    db.session.add(new_room)
    db.session.commit()

    return jsonify({"message": "Room added successfully", "room_id": new_room.id}), 201


@routes.route("/api/bookings", methods=["POST"])
def book_room():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

    data = request.get_json()
    room_id = data.get("room_id")
    staying_date = data.get("stay_date")

    if not room_id:
        return jsonify({"message": "Room ID is required"}), 400

    room = Room.query.get(room_id)
    if not room:
        return jsonify({"message": "Room not found"}), 404

    if not room.is_available:
        return jsonify({"message": "Room is not available"}), 400

    try:
        # Convert staying_date_str to a datetime object
        staying_date = datetime.datetime.strptime(staying_date, "%Y-%m-%d")
    except ValueError:
        return jsonify({"message": "Invalid date format. Use YYYY-MM-DD."}), 400

    # Create a new booking
    booking = Booking(
        user_id=user.id, room_id=room_id, staying_date=staying_date, status="booked"
    )

    # Ensure the booking_date is set (if it's None, use the current time)
    if not booking.booking_date:
        booking.booking_date = datetime.datetime.utcnow()

    # Calculate final price and discount for the booking
    booking.calculate_final_price()

    # Mark the room as unavailable
    room.is_available = False

    # Add to the database session and commit
    db.session.add(booking)
    db.session.commit()

    return (
        jsonify(
            {
                "message": "Room booked successfully",
                "booking_id": booking.id,
                "final_price": booking.final_price,
                "discount": booking.discount,
            }
        ),
        201,
    )


@routes.route("/api/bookings", methods=["GET"])
def get_user_bookings():
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

    # Fetch bookings for the logged-in user
    bookings = Booking.query.filter_by(user_id=user.id).all()

    # Serialize booking data with hotel name, room price, staying date, discount, and final price
    bookings_data = []
    for booking in bookings:
        room = Room.query.get(booking.room_id)  # Assuming Room model has room details
        hotel = Hotel.query.get(room.hotel_id)  # Assuming Hotel model has hotel details

        # Ensure discount and final price are calculated
        booking.calculate_final_price()

        bookings_data.append(
            {
                "id": booking.id,
                "room_id": booking.room_id,
                "hotel_name": hotel.name,  # Include the hotel name
                "room_price": room.price,  # Include the room price
                "booking_date": booking.booking_date,
                "staying_date": booking.staying_date,
                "status": booking.status,
                "discount": booking.discount,  # Add the discount
                "final_price": booking.final_price,  # Add the final price after discount
            }
        )

    return jsonify({"bookings": bookings_data}), 200


# API to cancel a booking
@routes.route("/api/bookings/<int:booking_id>", methods=["DELETE"])
def cancel_booking(booking_id):
    token = request.headers.get("Authorization")
    if not token:
        return jsonify({"message": "Token is missing"}), 401

    token = token.split(" ")[1] if " " in token else token
    try:
        decoded = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        user = User.query.get(decoded["id"])
    except jwt.ExpiredSignatureError:
        return jsonify({"message": "Token has expired"}), 401
    except jwt.InvalidTokenError:
        return jsonify({"message": "Invalid token"}), 401

    booking = Booking.query.get(booking_id)
    if not booking:
        return jsonify({"message": "Booking not found"}), 404

    if booking.user_id != user.id:
        return jsonify({"message": "You can only cancel your own bookings"}), 403

    # Cancel the booking and make the room available again
    room = booking.room
    room.is_available = True
    booking.status = "canceled"
    db.session.commit()

    return jsonify({"message": "Booking canceled successfully"}), 200


@routes.route("/api/hotels/<int:hotel_id>", methods=["PUT"])
def update_hotel(hotel_id):
    try:
        # Fetch the hotel by ID
        hotel = Hotel.query.get(hotel_id)
        if not hotel:
            return jsonify({"message": "Hotel not found"}), 404

        # Get updated data from request
        data = request.get_json()
        hotel.name = data.get("name", hotel.name)
        hotel.city = data.get("city", hotel.city)
        hotel.capacity = data.get("capacity", hotel.capacity)
        hotel.peak_season_rate = data.get("peak_season_rate", hotel.peak_season_rate)
        hotel.off_peak_rate = data.get("off_peak_rate", hotel.off_peak_rate)

        # Commit the changes
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Hotel updated successfully",
                    "hotel": {
                        "id": hotel.id,
                        "name": hotel.name,
                        "city": hotel.city,
                        "capacity": hotel.capacity,
                        "peak_season_rate": hotel.peak_season_rate,
                        "off_peak_rate": hotel.off_peak_rate,
                    },
                }
            ),
            200,
        )

        # return jsonify({"message": "Hotel updated successfully"}), 200
    except Exception as e:
        return jsonify({"message": "Error updating hotel", "error": str(e)}), 500


@routes.route("/api/hotels/<int:hotel_id>", methods=["DELETE"])
def delete_hotel(hotel_id):
    try:
        # Fetch the hotel by ID
        hotel = Hotel.query.get(hotel_id)
        if not hotel:
            return jsonify({"message": f"Hotel with ID {hotel_id} not found"}), 404

        # Optional: Check for any existing bookings or dependencies
        if hasattr(hotel, "bookings") and hotel.bookings.count() > 0:
            return (
                jsonify(
                    {
                        "message": "Cannot delete hotel with existing bookings",
                        "bookings_count": hotel.bookings.count(),
                    }
                ),
                409,
            )

        # Store hotel details for response
        hotel_details = {"id": hotel.id, "name": hotel.name, "city": hotel.city}

        # Delete the hotel
        db.session.delete(hotel)
        db.session.commit()

        return (
            jsonify(
                {
                    "message": "Hotel deleted successfully",
                    "deleted_hotel": hotel_details,
                }
            ),
            200,
        )

    except IntegrityError as e:
        db.session.rollback()
        return (
            jsonify(
                {
                    "message": "Cannot delete hotel due to existing relationships",
                    "error": str(e),
                }
            ),
            409,
        )

    except SQLAlchemyError as e:
        db.session.rollback()
        return jsonify({"message": "Database error occurred", "error": str(e)}), 500

    except Exception as e:
        if db.session.is_active:
            db.session.rollback()
        return jsonify({"message": "Unexpected error occurred", "error": str(e)}), 500


# reports


def get_user_booking_report(user_id):
    user = User.query.get(user_id)
    if not user:
        return f"User with ID {user_id} not found."

    bookings = user.bookings.all()
    report = []

    for booking in bookings:
        report.append(
            {
                "Booking ID": booking.id,
                "Hotel": booking.room.hotel.name,
                "Room Type": booking.room.room_type,
                "Booking Date": booking.booking_date.strftime("%Y-%m-%d"),
                "Staying Date": booking.staying_date.strftime("%Y-%m-%d"),
                "Final Price": booking.final_price,
                "Discount": booking.discount,
                "Status": booking.status,
            }
        )

    return report


@routes.route("/api/report/user/<int:user_id>", methods=["GET"])
def user_booking_report(user_id):
    print("cames here")
    report = get_user_booking_report(user_id)
    return jsonify(report)


def get_hotel_occupancy_report(hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return f"Hotel with ID {hotel_id} not found."

    total_rooms = hotel.rooms.count()
    available_rooms = hotel.rooms.filter_by(is_available=True).count()
    booked_rooms = total_rooms - available_rooms

    return {
        "Hotel Name": hotel.name,
        "City": hotel.city,
        "Total Rooms": total_rooms,
        "Available Rooms": available_rooms,
        "Booked Rooms": booked_rooms,
    }


@routes.route("/api/report/hotel/<int:hotel_id>/occupancy", methods=["GET"])
def hotel_occupancy_report(hotel_id):
    report = get_hotel_occupancy_report(hotel_id)
    return jsonify(report)


def get_booking_revenue_report(start_date, end_date):
    bookings = Booking.query.filter(
        Booking.booking_date >= start_date,
        Booking.booking_date <= end_date,
        Booking.status == "confirmed",
    ).all()

    total_revenue = sum(booking.final_price for booking in bookings)

    report = {
        "Start Date": start_date.strftime("%Y-%m-%d"),
        "End Date": end_date.strftime("%Y-%m-%d"),
        "Total Revenue": total_revenue,
        "Number of Bookings": len(bookings),
    }

    return report


@routes.route("/api/report/revenue", methods=["GET"])
def booking_revenue_report():
    start_date = request.args.get("start_date")
    end_date = request.args.get("end_date")

    if not start_date or not end_date:
        return jsonify({"error": "Start date and end date are required"}), 400

    try:
        start_date = datetime.datetime.strptime(start_date, "%Y-%m-%d")
        end_date = datetime.datetime.strptime(end_date, "%Y-%m-%d")

    except ValueError:
        return jsonify({"error": "Invalid date format. Use YYYY-MM-DD"}), 400

    report = get_booking_revenue_report(start_date, end_date)
    return jsonify(report)


def get_peak_vs_offpeak_revenue_report(hotel_id):
    hotel = Hotel.query.get(hotel_id)
    if not hotel:
        return f"Hotel with ID {hotel_id} not found."

    bookings = Booking.query.filter(
        Booking.room.has(hotel_id=hotel_id), Booking.status == "confirmed"
    ).all()

    peak_revenue = 0
    off_peak_revenue = 0

    for booking in bookings:
        if booking.staying_date.month in [
            6,
            7,
            12,
        ]:  # Assume peak months are June, July, and December
            peak_revenue += booking.final_price
        else:
            off_peak_revenue += booking.final_price

    return {
        "Hotel Name": hotel.name,
        "City": hotel.city,
        "Peak Season Revenue": peak_revenue,
        "Off-Peak Season Revenue": off_peak_revenue,
    }


@routes.route("/api/report/hotel/<int:hotel_id>/revenue", methods=["GET"])
def peak_vs_offpeak_report(hotel_id):
    report = get_peak_vs_offpeak_revenue_report(hotel_id)
    return jsonify(report)


def get_top_users(limit=5):
    # Assuming 'Booking.status' is the field that tracks booking status, where 'canceled' is the canceled status
    users = (
        User.query.join(Booking)
        .filter(Booking.status != "canceled")  # Exclude canceled bookings
        .group_by(User.id)
        .order_by(db.func.sum(Booking.final_price).desc())
        .limit(limit)
        .all()
    )

    report = []

    for user in users:
        # Calculate total spent from non-canceled bookings only
        total_spent = sum(
            booking.final_price
            for booking in user.bookings
            if booking.status != "canceled"
        )
        report.append(
            {
                "User ID": user.id,
                "Username": user.username,
                "Email": user.email,
                "Total Spend": total_spent,
                "Number of Bookings": sum(
                    1 for booking in user.bookings if booking.status != "canceled"
                ),
            }
        )

    return report


@routes.route("/api/report/top-users", methods=["GET"])
def top_users_report():
    limit = request.args.get("limit", default=5, type=int)
    report = get_top_users(limit)
    return jsonify(report)
