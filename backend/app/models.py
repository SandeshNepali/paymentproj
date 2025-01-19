from app.database import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime


# User model
class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default="user", nullable=False)  # 'user' or 'admin'

    bookings = db.relationship(
        "Booking", cascade="all, delete-orphan", backref="user", lazy="dynamic"
    )

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User {self.username}>"


# Hotel model
class Hotel(db.Model):
    __tablename__ = "hotels"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    city = db.Column(db.String(50), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    peak_season_rate = db.Column(db.Float, nullable=False)
    off_peak_rate = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Cascade delete for associated rooms
    rooms = db.relationship(
        "Room", cascade="all, delete-orphan", backref="hotel", lazy="dynamic"
    )

    def __repr__(self):
        return f"<Hotel {self.name} in {self.city}>"


# Room model
class Room(db.Model):
    __tablename__ = "rooms"
    id = db.Column(db.Integer, primary_key=True)
    hotel_id = db.Column(db.Integer, db.ForeignKey("hotels.id"), nullable=False)
    room_type = db.Column(db.String(20), nullable=False)  # Standard, Double, Family
    price = db.Column(db.Float, nullable=False)
    is_available = db.Column(db.Boolean, default=True)
    
    # Cascade delete for associated bookings
    bookings = db.relationship(
        "Booking", cascade="all, delete-orphan", backref="room", lazy="dynamic"
    )

    def __repr__(self):
        return f"<Room {self.room_type} in Hotel {self.hotel_id}>"


# Booking model
class Booking(db.Model):
    __tablename__ = "bookings"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    room_id = db.Column(db.Integer, db.ForeignKey("rooms.id"), nullable=False)
    booking_date = db.Column(db.DateTime, default=datetime.utcnow)
    staying_date = db.Column(db.DateTime, nullable=False)
    status = db.Column(
        db.String(20), default="pending"
    )  # status could be 'pending', 'confirmed', or 'canceled'
    discount = db.Column(db.Float, default=0.0)  # Discount applied on booking
    final_price = db.Column(db.Float, nullable=False)  # Final price after discount

    def calculate_discount(self, base_price):
        """
        Calculate discount based on the number of days in advance the booking is made.
        """
        if not self.staying_date or not self.booking_date:
            raise ValueError("Staying date or booking date is not set")

        days_in_advance = (self.staying_date - self.booking_date).days
        print(days_in_advance)

        if 80 <= days_in_advance <= 90:
            return base_price * 0.30  # 30% discount
        elif 60 <= days_in_advance <= 79:
            return base_price * 0.20  # 20% discount
        elif 45 <= days_in_advance <= 59:
            return base_price * 0.10  # 10% discount
        else:
            return 0.0  # No discount

    def calculate_final_price(self):
        """
        Calculate the final price after applying the discount.
        """
        room = Room.query.get(self.room_id)
        if room:
            base_price = room.price
            self.discount = self.calculate_discount(base_price)
            self.final_price = base_price - self.discount
        else:
            self.discount = 0.0
            self.final_price = 0.0

    def __repr__(self):
        return f"<Booking {self.id} for Room {self.room_id} by User {self.user_id}>"
