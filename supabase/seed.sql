-- Seed sample historical events (run after migrations)
insert into public.historical_events (title, date, summary, content, image_url)
values
  (
    'The Moon Landing',
    'July 20, 1969',
    'Apollo 11 lands on the Moon. Neil Armstrong and Buzz Aldrin become the first humans to walk on the lunar surface.',
    'On July 20, 1969, the Apollo 11 mission achieved one of humanity''s greatest milestones when Neil Armstrong and Buzz Aldrin set foot on the Moon while Michael Collins orbited above. Armstrong''s words—"That''s one small step for man, one giant leap for mankind"—marked a defining moment in the Space Age.',
    'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'
  ),
  (
    'Fall of the Berlin Wall',
    'November 9, 1989',
    'The Berlin Wall opens after 28 years, leading to the reunification of Germany and symbolizing the end of the Cold War in Europe.',
    'The fall of the Berlin Wall on November 9, 1989, followed weeks of protests and a miscommunicated policy change. East German border guards opened the checkpoints, and crowds from both sides crossed freely. The event accelerated the collapse of the Eastern Bloc and led to German reunification in 1990.',
    'https://images.unsplash.com/photo-1569931721090-b1b2f2c8c66e?w=800'
  ),
  (
    'World Wide Web Becomes Public',
    'August 6, 1991',
    'Tim Berners-Lee releases the World Wide Web to the public, changing how the world communicates and accesses information.',
    'On August 6, 1991, Tim Berners-Lee posted a summary of the World Wide Web project on public newsgroups, effectively making it available to everyone. The web combined hypertext, the internet, and personal computers into a global information system that would reshape society, commerce, and culture.',
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'
  )
;
