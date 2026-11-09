import uuid
from datetime import datetime, timezone, timedelta
from sqlalchemy import select
from app.core.security import hash_password
from app.models import (
    Role,
    User,
    UserRole,
    Forest,
    Biodiversity,
    WildlifeSighting,
    WaterReading,
    SatelliteObservation,
    Alert,
    Report,
    ConservationProject,
    Document,
    DocumentChunk,
)


def seed_database(db):
    # 1. Seed Default Administrative & Ranger Accounts
    officer_email = "officer@vasundhara.gov.in"
    admin_email = "admin@vasundhara.gov.in"
    citizen_email = "citizen@vasundhara.org"

    admin_role = db.scalar(select(Role).where(Role.name == "super_admin"))
    officer_role = db.scalar(select(Role).where(Role.name == "officer"))
    citizen_role = db.scalar(select(Role).where(Role.name == "citizen"))

    admin_user = db.scalar(select(User).where(User.email == admin_email))
    if not admin_user and admin_role:
        admin_user = User(
            id=uuid.uuid4(),
            full_name="Dr. Sunita Narain (Super Admin)",
            email=admin_email,
            password_hash=hash_password("Vasundhara@2026"),
        )
        db.add(admin_user)
        db.flush()
        db.add(UserRole(user_id=admin_user.id, role_id=admin_role.id))

    officer_user = db.scalar(select(User).where(User.email == officer_email))
    if not officer_user and officer_role:
        officer_user = User(
            id=uuid.uuid4(),
            full_name="Ranger Rajesh Kumar (Karnataka Forest Dept)",
            email=officer_email,
            password_hash=hash_password("Vasundhara@2026"),
        )
        db.add(officer_user)
        db.flush()
        db.add(UserRole(user_id=officer_user.id, role_id=officer_role.id))

    citizen_user = db.scalar(select(User).where(User.email == citizen_email))
    if not citizen_user and citizen_role:
        citizen_user = User(
            id=uuid.uuid4(),
            full_name="Asha Hegde (Western Ghats Conservationist)",
            email=citizen_email,
            password_hash=hash_password("Vasundhara@2026"),
        )
        db.add(citizen_user)
        db.flush()
        db.add(UserRole(user_id=citizen_user.id, role_id=citizen_role.id))

    db.commit()

    # 2. Seed Western Ghats Forests if empty
    forest_count = db.scalar(select(Forest))
    if not forest_count:
        forests_data = [
            {"name": "Kudremukh National Park", "state": "Karnataka", "protected_status": "National Park", "latitude": 13.2185, "longitude": 75.2575, "area_sq_km": 600.32},
            {"name": "Bandipur National Park", "state": "Karnataka", "protected_status": "Tiger Reserve", "latitude": 11.6664, "longitude": 76.6291, "area_sq_km": 874.20},
            {"name": "Nagarhole National Park", "state": "Karnataka", "protected_status": "Tiger Reserve", "latitude": 12.0314, "longitude": 76.1207, "area_sq_km": 643.39},
            {"name": "Kali (Anshi-Dandeli) Tiger Reserve", "state": "Karnataka", "protected_status": "Tiger Reserve", "latitude": 15.0210, "longitude": 74.3512, "area_sq_km": 1300.0},
            {"name": "Bhadra Wildlife Sanctuary", "state": "Karnataka", "protected_status": "Wildlife Sanctuary", "latitude": 13.6934, "longitude": 75.6358, "area_sq_km": 492.46},
            {"name": "Agumbe Rainforest Research Reserve", "state": "Karnataka", "protected_status": "Rainforest Reserve", "latitude": 13.5074, "longitude": 75.0931, "area_sq_km": 120.0},
            {"name": "Brahmagiri Wildlife Sanctuary", "state": "Karnataka", "protected_status": "Wildlife Sanctuary", "latitude": 12.0125, "longitude": 75.9234, "area_sq_km": 181.80},
        ]
        for f in forests_data:
            db.add(Forest(**f))
        db.commit()

    # 3. Seed Biodiversity Species if empty
    bio_count = db.scalar(select(Biodiversity))
    if not bio_count:
        species_data = [
            {"scientific_name": "Panthera tigris", "common_name": "Bengal Tiger", "iucn_status": "Endangered", "is_sensitive": True, "taxa": "Mammal", "description": "Apex predator of the Western Ghats moist deciduous and evergreen forests. Protected under Schedule I of WPA 1972."},
            {"scientific_name": "Elephas maximus", "common_name": "Asian Elephant", "iucn_status": "Endangered", "is_sensitive": True, "taxa": "Mammal", "description": "Keystone megaherbivore maintaining forest corridors between Karnataka, Kerala, and Tamil Nadu."},
            {"scientific_name": "Macaca silenus", "common_name": "Lion-tailed Macaque", "iucn_status": "Endangered", "is_sensitive": True, "taxa": "Primate", "description": "Arboreal primate endemic to the canopy of evergreen rainforests in the Western Ghats (Agumbe, Silent Valley)."},
            {"scientific_name": "Nilgiritragus hylocrius", "common_name": "Nilgiri Tahr", "iucn_status": "Endangered", "is_sensitive": True, "taxa": "Ungulate", "description": "Endemic mountain ungulate inhabiting montane shola grassland ecosystems."},
            {"scientific_name": "Buceros bicornis", "common_name": "Great Indian Hornbill", "iucn_status": "Vulnerable", "is_sensitive": False, "taxa": "Bird", "description": "Vital seed disperser responsible for regenerating old-growth rainforest trees across Karnataka."},
            {"scientific_name": "Ratufa indica", "common_name": "Malabar Giant Squirrel", "iucn_status": "Least Concern", "is_sensitive": False, "taxa": "Rodent", "description": "Large tree squirrel characteristic of dense canopy formations in Kudremukh and Dandeli."},
            {"scientific_name": "Ophiophagus hannah", "common_name": "King Cobra", "iucn_status": "Vulnerable", "is_sensitive": True, "taxa": "Reptile", "description": "World's longest venomous snake, heavily studied in the Agumbe rainforest reserve."},
            {"scientific_name": "Panthera pardus", "common_name": "Indian Leopard", "iucn_status": "Vulnerable", "is_sensitive": False, "taxa": "Mammal", "description": "Adaptable big cat frequenting forest-edge interfaces and rocky outcrops in Bandipur and Nagarhole."},
        ]
        for s in species_data:
            db.add(Biodiversity(**s))
        db.commit()

    # 4. Seed Wildlife Sightings if empty
    sighting_count = db.scalar(select(WildlifeSighting))
    if not sighting_count:
        tiger = db.scalar(select(Biodiversity).where(Biodiversity.scientific_name == "Panthera tigris"))
        elephant = db.scalar(select(Biodiversity).where(Biodiversity.scientific_name == "Elephas maximus"))
        macaque = db.scalar(select(Biodiversity).where(Biodiversity.scientific_name == "Macaca silenus"))
        hornbill = db.scalar(select(Biodiversity).where(Biodiversity.scientific_name == "Buceros bicornis"))
        cobra = db.scalar(select(Biodiversity).where(Biodiversity.scientific_name == "Ophiophagus hannah"))

        now_utc = datetime.now(timezone.utc)
        sightings = [
            {"species_id": tiger.id if tiger else None, "species_name": "Bengal Tiger", "latitude": 11.6780, "longitude": 76.6350, "observed_at": now_utc - timedelta(hours=3), "source": "camera_trap_04", "confidence": 0.94, "image_url": "/images/tiger_sighting.jpg"},
            {"species_id": elephant.id if elephant else None, "species_name": "Asian Elephant", "latitude": 12.0450, "longitude": 76.1350, "observed_at": now_utc - timedelta(hours=6), "source": "ranger_patrol", "confidence": 0.98, "image_url": "/images/elephant_herd.jpg"},
            {"species_id": macaque.id if macaque else None, "species_name": "Lion-tailed Macaque", "latitude": 13.5120, "longitude": 75.0890, "observed_at": now_utc - timedelta(hours=14), "source": "camera_trap_12", "confidence": 0.91, "image_url": "/images/macaque.jpg"},
            {"species_id": hornbill.id if hornbill else None, "species_name": "Great Indian Hornbill", "latitude": 13.2250, "longitude": 75.2610, "observed_at": now_utc - timedelta(hours=22), "source": "citizen_report", "confidence": 0.89, "image_url": "/images/hornbill.jpg"},
            {"species_id": cobra.id if cobra else None, "species_name": "King Cobra", "latitude": 13.5040, "longitude": 75.0970, "observed_at": now_utc - timedelta(days=1), "source": "camera_trap_09", "confidence": 0.95, "image_url": "/images/king_cobra.jpg"},
        ]
        for st in sightings:
            db.add(WildlifeSighting(**st))
        db.commit()

    # 5. Seed Water Readings if empty
    water_count = db.scalar(select(WaterReading))
    if not water_count:
        now_utc = datetime.now(timezone.utc)
        stations = [
            {"station_id": "NETRA-STN-01", "basin_name": "Netravati River Basin (Bantwal)", "latitude": 12.8945, "longitude": 75.0321, "ph": 7.3, "turbidity_ntu": 4.2, "temperature_c": 26.8, "dissolved_oxygen_mgl": 7.4, "measured_at": now_utc},
            {"station_id": "KALI-STN-04", "basin_name": "Kali River Gorge (Dandeli)", "latitude": 15.2410, "longitude": 74.6210, "ph": 7.6, "turbidity_ntu": 3.1, "temperature_c": 24.5, "dissolved_oxygen_mgl": 8.1, "measured_at": now_utc - timedelta(minutes=45)},
            {"station_id": "SHARA-STN-02", "basin_name": "Sharavathi Valley Basin (Jog)", "latitude": 14.2280, "longitude": 74.8120, "ph": 6.9, "turbidity_ntu": 5.8, "temperature_c": 25.2, "dissolved_oxygen_mgl": 7.8, "measured_at": now_utc - timedelta(hours=1)},
            {"station_id": "KAVERI-STN-03", "basin_name": "Upper Kaveri Basin (Kushalnagar)", "latitude": 12.4580, "longitude": 75.9520, "ph": 7.1, "turbidity_ntu": 6.4, "temperature_c": 23.9, "dissolved_oxygen_mgl": 7.0, "measured_at": now_utc - timedelta(hours=2)},
            {"station_id": "BHADRA-STN-05", "basin_name": "Bhadra River Catchment (Lakkavalli)", "latitude": 13.7120, "longitude": 75.6420, "ph": 7.4, "turbidity_ntu": 3.9, "temperature_c": 26.1, "dissolved_oxygen_mgl": 7.6, "measured_at": now_utc - timedelta(hours=3)},
        ]
        for w in stations:
            db.add(WaterReading(**w))
        db.commit()

    # 6. Seed Sample Incident Reports if empty
    report_count = db.scalar(select(Report))
    if not report_count:
        now_utc = datetime.now(timezone.utc)
        sample_reports = [
            {
                "user_id": citizen_user.id if citizen_user else uuid.uuid4(),
                "category": "illegal_logging",
                "description": "Suspected illegal felling of Rosewood and Teak trees along the stream buffer in Kudremukh perimeter.",
                "latitude": 13.2350,
                "longitude": 75.2410,
                "status": "investigating",
                "created_at": now_utc - timedelta(hours=8),
            },
            {
                "user_id": citizen_user.id if citizen_user else uuid.uuid4(),
                "category": "forest_fire",
                "description": "Smoke plumes and spreading surface scrub fire observed near Bandipur Southern corridor bordering Wayanad.",
                "latitude": 11.6420,
                "longitude": 76.6110,
                "status": "verified",
                "created_at": now_utc - timedelta(hours=4),
            },
            {
                "user_id": citizen_user.id if citizen_user else uuid.uuid4(),
                "category": "water_pollution",
                "description": "Chemical effluent discharge turning stream water discolored and turbid near industrial packaging unit in Netravati downstream.",
                "latitude": 12.8720,
                "longitude": 75.0190,
                "status": "submitted",
                "created_at": now_utc - timedelta(hours=1),
            },
        ]
        for rep in sample_reports:
            db.add(Report(**rep))
        db.commit()

    # 7. Seed Active Alerts if empty
    alert_count = db.scalar(select(Alert))
    if not alert_count:
        alerts_data = [
            {
                "title": "High Wildfire Vulnerability: Bandipur South Buffer",
                "description": "Dry spell of 24 consecutive days combined with temperatures exceeding 38.5°C and moisture depletion. Thermal anomaly hotspot detected by NASA FIRMS.",
                "severity": "critical",
                "verification_status": "verified",
            },
            {
                "title": "Vegetation Canopy Loss Candidate: Kudremukh Sector 4B",
                "description": "Sentinel-2 temporal analysis detected ΔNDVI of -0.28 over 12 contiguous pixels. Ranger dispatch recommended for ground verification.",
                "severity": "high",
                "verification_status": "verified",
            },
            {
                "title": "Turbidity Spike Alert: Netravati Monitoring Station 01",
                "description": "Turbidity surge reaching 14.8 NTU following unseasonable storm runoff and sand mining dredging.",
                "severity": "medium",
                "verification_status": "unverified",
            },
        ]
        for a in alerts_data:
            db.add(Alert(**a))
        db.commit()

    # 8. Seed Conservation Projects
    proj_count = db.scalar(select(ConservationProject))
    if not proj_count:
        projects = [
            {
                "title": "Western Ghats Native Tree Reforestation: Kudremukh Shola Corridor",
                "description": "Restoration of fragmented montane shola forest corridors to reconnect elephant migration paths between Kudremukh and Someshwara.",
                "target_saplings": 10000,
                "planted_count": 3450,
                "latitude": 13.2185,
                "longitude": 75.2575,
                "status": "active",
            },
            {
                "title": "Agumbe Rainforest Canopy Preservation & Bioacoustic Sensor Grid",
                "description": "Deployment of automated acoustic sensor nodes to monitor King Cobra and Lion-tailed Macaque calls while deterring timber poachers.",
                "target_saplings": 5000,
                "planted_count": 2100,
                "latitude": 13.5074,
                "longitude": 75.0931,
                "status": "active",
            },
            {
                "title": "Netravati Riverbank Riparian Zone Restoration",
                "description": "Community planting of indigenous bamboo and Vetiver grass along 15 km of riverbanks to prevent soil erosion and agricultural runoff.",
                "target_saplings": 8000,
                "planted_count": 5200,
                "latitude": 12.8945,
                "longitude": 75.0321,
                "status": "active",
            },
        ]
        for p in projects:
            db.add(ConservationProject(**p))
        db.commit()

    # 9. Seed Research Documents & Chunks for RAG
    doc_count = db.scalar(select(Document))
    if not doc_count:
        docs = [
            {
                "title": "India State of Forest Report (ISFR 2023) – Western Ghats Assessment",
                "source_url": "https://fsi.nic.in/forest-report-2023",
                "publisher": "Forest Survey of India, Ministry of Environment, Forest & Climate Change",
                "category": "National Government Report",
                "summary": "Official biennial assessment of forest and tree cover across India, highlighting Western Ghats evergreen canopy trends, carbon stock, and fire vulnerability.",
                "chunks": [
                    "The Western Ghats of Karnataka harbor approximately 20,400 sq km of dense evergreen and semi-evergreen forest cover. According to the India State of Forest Report (ISFR 2023), very dense forest (VDF) canopy density (>70%) has shown stability in protected core areas like Kudremukh and Nagarhole, but moderately dense forests (MDF) face fragmentation pressure along peripheral transition zones.",
                    "Forest fires in Karnataka predominantly occur during the dry pre-monsoon window (February to May). ISFR 2023 remote sensing analysis via MODIS and SNPP-VIIRS identifies dry deciduous corridors in Bandipur, Chamrajnagar, and Bannerghatta as high-susceptibility zones requiring early warning thermal observation.",
                    "Forest carbon stock in Karnataka is estimated at over 325 million tonnes, with Western Ghats shola-grassland complexes acting as essential hydrological sponges regulating east- and west-flowing peninsular rivers including the Kaveri, Tungabhadra, Netravati, and Sharavathi.",
                ],
            },
            {
                "title": "Western Ghats Ecology Expert Panel (WGEEP) – Conservation Directives",
                "source_url": "https://moef.gov.in/en/division/forest-divisions/western-ghats/",
                "publisher": "Ministry of Environment, Forest and Climate Change (MoEFCC)",
                "category": "Ecological Policy Directive",
                "summary": "Comprehensive ecological boundary assessment designating Ecologically Sensitive Zones (ESZ-1, ESZ-2, ESZ-3) across Western Ghats taluks.",
                "chunks": [
                    "The Western Ghats is recognized internationally as one of the world's eight 'hottest hotspots' of biological diversity. The mountain chain traverses six states with over 5,000 flowering plant species, 139 mammal species, 508 bird species, and 179 amphibian species, over 60% of which are strictly endemic.",
                    "Ecologically Sensitive Zone 1 (ESZ-1) mandates strict prohibition of red-category heavy industries, commercial mining, and deforestation. Community-based forest governance and participatory protection networks (such as JanRakshak platforms) are strongly recommended to empower local panchayats in monitoring encroachment.",
                    "Preservation of riparian vegetation buffers along west-flowing rivers (such as Kali, Bedthi, Aghanashini, Sharavathi, and Netravati) is critical to maintaining estuarine salinity gradients and protecting endangered fish breeding grounds.",
                ],
            },
            {
                "title": "Wild Life (Protection) Act, 1972 & Amendment Act 2022 Overview",
                "source_url": "https://pib.gov.in/PressReleasePage.aspx?PRID=1847620",
                "publisher": "Parliament of India / Legislative Department",
                "category": "Statutory Legislation",
                "summary": "Legal framework for wildlife sanctuary designation, endangered species protection schedules, anti-poaching penalties, and citizen reporting duties.",
                "chunks": [
                    "The Wildlife Protection (Amendment) Act 2022 streamlined species schedules from six to four, granting Schedule I status to critically endangered taxa such as the Bengal Tiger (Panthera tigris), Asian Elephant (Elephas maximus), Lion-tailed Macaque (Macaca silenus), and King Cobra (Ophiophagus hannah).",
                    "Offenses involving Schedule I species or within Tiger Reserves and National Parks carry mandatory imprisonment of not less than three years, extendable to seven years, along with minimum fines of ₹25,000 to ₹5,00,000 for repeat poaching or illegal habitat disruption.",
                    "Section 50 empowers authorized Forest Officers, Police, and designated conservation inspectors to enter, search, arrest without warrant, and seize weapons, tools, or vehicles used in wildlife crimes. Verified citizen digital reports provide admissible evidentiary leads for prompt field investigations.",
                ],
            },
        ]

        for d in docs:
            chunks = d.pop("chunks")
            doc_obj = Document(**d)
            db.add(doc_obj)
            db.flush()
            for idx, ctext in enumerate(chunks):
                db.add(DocumentChunk(
                    document_id=doc_obj.id,
                    chunk_index=idx,
                    chunk_text=ctext,
                    metadata_json={"source": doc_obj.title, "publisher": doc_obj.publisher},
                ))
        db.commit()

