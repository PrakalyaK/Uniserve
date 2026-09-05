# UniServ National Cooperative IVRS (Interactive Voice Response System)

## 📌 Abstract & Purpose
UniServ's **Toll-Free IVRS (1800-890-UNISERV / 1800-890-8647)** delivers **100% digital inclusion** for elderly citizens, rural households, and non-smartphone (button mobile / landline) users across India.

---

## 🔄 The 2-Phase Operational Lifecycle:

### Phase 1: Assisted One-Time Registration
- **Channel**: Village E-Sevai Maiyam / CSC Center / Helpful Neighbour via UniServ App.
- **Data Saved**: Citizen's Button Mobile Number, Full Name, Doorstep Address, Landmark, Preferred Language.
- **Confirmation**: SMS delivered to button phone with Toll-Free Helpline: `1800-890-UNISERV`.

### Phase 2: Zero-Touch Toll-Free Voice Booking
- Citizen dials `1800-890-UNISERV` from their registered button phone.
- The Cloud Telephony Server reads **Caller-ID (CLI)**, looks up the citizen in the central registry, and speaks aloud in their registered language (*Tamil / Hindi / English*).
- Supports all **10 trade fields** + **Repeat (`*`)** feature:
  - `[ 1 ]` ⚡ Electrician (மின்சாரம் / इलेक्ट्रीशियन)
  - `[ 2 ]` 🔧 Plumber (பிளம்பிங் / प्लंबर)
  - `[ 3 ]` 🪚 Carpenter (தச்சு வேலை / बढ़ई)
  - `[ 4 ]` 🧹 Home Cleaning (வீடு சுத்தம் / गृह सफाई)
  - `[ 5 ]` 🎨 Painting (வர்ணம் பூசுதல் / पेंटिंग)
  - `[ 6 ]` ❄️ Appliance Repair (வீட்டு உபகரணங்கள் / उपकरण मरम्मत)
  - `[ 7 ]` 🧱 Masonry & Tiles (கொத்தனார் & டைல்ஸ் / चिनाई व टाइल)
  - `[ 8 ]` 🐜 Pest Control (பூச்சி கட்டுப்பாடு / कीट नियंत्रण)
  - `[ 9 ]` 🚗 Driver & Cab (டிரைவர் சேவை / ड्राइवर)
  - `[ 0 ]` 🌱 Gardening (தோட்ட வேலை / बागवानी)
  - `[ * ]` 🔁 **REPEAT MENU** (மீண்டும் கேட்க / मेनू दोबारा सुनने के लिए)
  - `[ # ]` ↩️ Back / Cancel (முந்தைய மெனு / वापस जाएं)

---

## 🌐 Production PSTN Cloud Telephony Webhook (Node.js / Twilio / Exotel):

```javascript
// Sample Node.js / Express Webhook for 1800-890-UNISERV
const express = require('express');
const { VoiceResponse } = require('twilio').twiml;
const { usersDb, createBooking } = require('./uniservService');

const app = express();
app.use(express.urlencoded({ extended: true }));

// Incoming Call Webhook (Triggered when citizen dials 1800-890-UNISERV)
app.post('/ivrs/incoming', (req, res) => {
  const callerPhone = (req.body.From || '').replace(/[^0-9]/g, '').slice(-10);
  const twiml = new VoiceResponse();

  const citizen = usersDb[callerPhone];

  if (!citizen) {
    // Unregistered Caller
    twiml.say({ language: 'ta-IN' }, 'வணக்கம்! யூனிசெர்வ் உதவி மையத்திற்கு தங்களை வரவேற்கிறோம். உங்கள் மொபைல் எண் இன்னும் பதிவு செய்யப்படவில்லை.');
    twiml.say({ language: 'ta-IN' }, 'அருகிலுள்ள இ-சேவை மையம் அல்லது அண்டை வீட்டார் மூலம் பதிவு செய்யவும். நேரடி உதவிக்கு 9 அழுத்தவும்.');
    const gather = twiml.gather({ numDigits: 1, action: '/ivrs/unregistered-action' });
    return res.type('text/xml').send(twiml.toString());
  }

  // Registered Caller -> Greet by Name and Address
  const lang = citizen.language === 'ta' ? 'ta-IN' : citizen.language === 'hi' ? 'hi-IN' : 'en-IN';

  twiml.say({ language: lang }, `வணக்கம் ${citizen.name} அவர்களே! உங்கள் முகவரி ${citizen.address}.`);
  
  const gather = twiml.gather({
    numDigits: 1,
    action: `/ivrs/select-service?phone=${callerPhone}`,
    timeout: 10
  });

  gather.say({ language: lang }, 'மின்சார வேலைக்கு 1, பிளம்பிங் வேலைக்கு 2, தச்சு வேலைக்கு 3, துப்புரவு வேலைக்கு 4, டிரைவர் சேவைக்கு 9, தோட்ட வேலைக்கு 0 அழுத்தவும். மீண்டும் கேட்க ஸ்டார் (*) அழுத்தவும்.');

  // If no input received, loop repeat
  twiml.redirect('/ivrs/incoming');
  res.type('text/xml').send(twiml.toString());
});

app.listen(3000, () => console.log('UniServ IVRS Telephony Gateway active on port 3000'));
```
