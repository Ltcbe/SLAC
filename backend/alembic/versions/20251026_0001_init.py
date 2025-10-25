from alembic import op
import sqlalchemy as sa

revision = "20251026_0001"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "routes",
        sa.Column("id", sa.Integer, primary_key=True),
        sa.Column("code", sa.String(64), unique=True, nullable=False),
        sa.Column("origin", sa.String(64), nullable=False),
        sa.Column("dest", sa.String(64), nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_table(
        "trips",
        sa.Column("id", sa.BigInteger, primary_key=True),
        sa.Column("ext_id", sa.String(128), nullable=False),
        sa.Column("route_id", sa.Integer, sa.ForeignKey("routes.id", ondelete="CASCADE"), index=True),
        sa.Column("departure_ts", sa.DateTime(timezone=True), index=True),
        sa.Column("arrival_ts", sa.DateTime(timezone=True), index=True),
        sa.Column("delay_sec", sa.Integer, default=0, nullable=False),
        sa.Column("status", sa.String(32), index=True),  # scheduled, departed, arrived, cancelled
        sa.Column("stops", sa.JSON, nullable=False, server_default=sa.text("'[]'::json")),
        sa.Column("raw", sa.JSON, nullable=False, server_default=sa.text("'{}'::json")),
        sa.Column("hash", sa.String(64), index=True),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now()),
    )
    op.create_index("ix_trips_route_time", "trips", ["route_id", "departure_ts"]) 

def downgrade():
    op.drop_table("trips")
    op.drop_table("routes")
