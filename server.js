const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "listings.json");

fs.mkdirSync(DATA_DIR, { recursive: true });

if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "[]", "utf8");
}

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function readListings() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return [];
  }
}

function saveListings(listings) {
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify(listings, null, 2),
    "utf8"
  );
}

function normalize(item) {
  return {
    ...item,
    wasteType: item.waste_type,
    quantity: item.quantity_kg
  };
}

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "AgriLoop AI" });
});

app.get("/api/listings", (req, res) => {
  const search = String(req.query.search || "").toLowerCase();
  const type = String(req.query.type || "");

  const listings = readListings().filter(item => {
    const text = [
      item.waste_type,
      item.location,
      item.notes
    ].join(" ").toLowerCase();

    return text.includes(search) &&
      (!type || item.waste_type === type);
  });

  res.json({ listings: listings.map(normalize) });
});

app.get("/api/stats", (req, res) => {
  const listings = readListings();

  res.json({
    listing_count: listings.length,
    total_kg: listings.reduce(
      (sum, item) => sum + Number(item.quantity_kg || 0), 0
    ),
    locations_count: new Set(
      listings.map(item => item.location)
    ).size
  });
});

app.post("/api/listings", (req, res) => {
  const body = req.body || {};

  const wasteType = String(
    body.waste_type || body.wasteType || body.waste || ""
  ).trim();

  const quantity = Number(
    body.quantity_kg ?? body.quantity
  );

  const location = String(body.location || "").trim();

  const availability = String(
    body.availability || "अभी उपलब्ध"
  ).trim();

  const notes = String(body.notes || "").trim();

  if (!wasteType || !location ||
      !Number.isFinite(quantity) || quantity <= 0) {
    return res.status(400).json({
      error: "Waste type, location and valid quantity are required."
    });
  }

  const listings = readListings();

  const listing = {
    id: Date.now().toString(),
    waste_type: wasteType,
    quantity_kg: quantity,
    location,
    availability,
    notes,
    created_at: new Date().toISOString()
  };

  listings.unshift(listing);
  saveListings(listings);

  res.status(201).json({
    message: "Listing saved successfully",
    listing: normalize(listing)
  });
});

app.delete("/api/listings/:id", (req, res) => {
  const listings = readListings();
  const updated = listings.filter(
    item => String(item.id) !== String(req.params.id)
  );

  if (updated.length === listings.length) {
    return res.status(404).json({
      error: "Listing not found"
    });
  }

  saveListings(updated);
  res.json({ message: "Listing deleted successfully" });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`AgriLoop AI running on port ${PORT}`);
});
