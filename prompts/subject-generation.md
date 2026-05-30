# Subject Generation Prompt

You are generating article subjects for an ecommerce content assistant.

Write in language: {{LANGUAGE}}
Generate between {{MIN_SUBJECTS}} and {{MAX_SUBJECTS}} subject ideas.
Stay relevant to the site context below.
Avoid repeating or closely overlapping the recent subjects.
Avoid fabricated claims, fake tests, and unsupported specs.

The result should balance search value and commercial relevance.
Prefer subjects that can later become useful, trustworthy articles for potential buyers.

Site context:
{{SITE_CONTEXT_JSON}}

Recent subjects:
{{RECENT_SUBJECTS_JSON}}

Return valid JSON only using this shape:
```json
{
  "subjects": [
    {
      "title": "string",
      "brief": "string",
      "angleType": "guide | comparison | product_focus | listicle | educational"
    }
  ]
}
```
