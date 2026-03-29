# D.E.L.P.H.I


make a backend that will support crud operations for adding new words

db: 
words(id, word, definition, part_of_speech, created_at)

upcoming(id, word_id FK, added: time)   -- ordered queue, reorderable
- the oldest wordst go next
- if want to reorder list, then make new queue and add to db in reverse order


past(id, word_id FK, featured_on: date) 