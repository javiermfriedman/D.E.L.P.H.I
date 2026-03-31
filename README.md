# D.E.L.P.H.I


make a backend that will support crud operations for adding new words

db: 
words(id, word, definition, part_of_speech, created_at)

upcoming(id, word_id FK, added: time)   -- ordered queue, reorderable
- the oldest wordst go next
- if want to reorder list, then make new queue and add to db in reverse order


past(id, word_id FK, featured_on: date) 

src/
├── main.jsx
├── App.jsx                  # Route: "/" = Landing, "/dashboard" = Dashboard
│
├── pages/
│   ├── Landing.jsx          # Full landing page with animation + Enter CTA
│   └── Dashboard.jsx        # Shell: sidebar + main content area
│
├── components/
│   ├── landing/
│   │   ├── WordParticles.jsx     # Floating/morphing ambient word animation
│   │   └── TypewriterTitle.jsx   # D.E.L.P.H.I letter-by-letter reveal
│   │
│   ├── sidebar/
│   │   └── Sidebar.jsx           # Nav links: Upcoming, Past, Add Word
│   │
│   ├── upcoming/
│   │   ├── UpcomingTimeline.jsx  # Vertical roadmap spine + nodes
│   │   └── TimelineNode.jsx      # Individual word node with delete
│   │
│   ├── past/
│   │   ├── PastWordsGrid.jsx     # Masonry grid container
│   │   └── WordCard.jsx          # Individual glass card
│   │
│   └── modals/
│       └── AddWordModal.jsx      # Live-lookup form modal
│
├── hooks/
│   ├── useUpcomingWords.js       # Fetch + delete upcoming
│   ├── usePastWords.js           # Fetch past words
│   └── useDictionaryLookup.js    # Debounced lookup as user types
│
└── api/
    └── client.js                 # All fetch calls to your FastAPI backend