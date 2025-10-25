from sqlalchemy import Integer, BigInteger, String, DateTime, JSON, func, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from .db import Base

class Route(Base):
    __tablename__ = "routes"
    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    code: Mapped[str] = mapped_column(String(64), unique=True)
    origin: Mapped[str] = mapped_column(String(64))
    dest: Mapped[str] = mapped_column(String(64))
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    trips = relationship("Trip", back_populates="route")

class Trip(Base):
    __tablename__ = "trips"
    id: Mapped[int] = mapped_column(BigInteger, primary_key=True)
    ext_id: Mapped[str] = mapped_column(String(128), index=True)
    route_id: Mapped[int] = mapped_column(Integer, ForeignKey("routes.id", ondelete="CASCADE"), index=True)
    departure_ts: Mapped[DateTime] = mapped_column(DateTime(timezone=True), index=True)
    arrival_ts: Mapped[DateTime] = mapped_column(DateTime(timezone=True))
    delay_sec: Mapped[int] = mapped_column(Integer, default=0)
    status: Mapped[str] = mapped_column(String(32), index=True)
    stops: Mapped[dict] = mapped_column(JSON)
    raw: Mapped[dict] = mapped_column(JSON)
    hash: Mapped[str | None] = mapped_column(String(64), index=True)
    created_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[DateTime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    route = relationship("Route", back_populates="trips")
