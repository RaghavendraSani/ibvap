from sqlalchemy import Boolean, Column, Integer, String

from backend.app.database import Base


class Camera(Base):

    __tablename__ = "cameras"

    id = Column(Integer, primary_key=True, index=True)

    camera_id = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True,
    )

    name = Column(
        String(100),
        nullable=False,
    )

    rtsp_url = Column(
        String(500),
        nullable=False,
    )

    location = Column(
        String(200),
        nullable=True,
    )

    camera_type = Column(
        String(50),
        default="CCTV",
    )

    analytics_enabled = Column(
        Boolean,
        default=True,
    )

    is_online = Column(
        Boolean,
        default=False,
    )
