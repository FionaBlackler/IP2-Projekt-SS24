# This schema is used for validation against the uploaded json input
umfrage_schema = {
    "type": "object",
    "properties": {
        "titel": {"type": "string"},
        "beschreibung": {"type": "string"},
        "fragen": {
            "type": "array",
            "items": {
                "type": "object",
                "properties": {
                    "art": {"type": "string"},
                    "frage_text": {"type": "string"},
                    "richtige_antworten": {
                        "type": "array",
                        "items": {"type": "string"},
                    },
                    "falsche_antworten": {"type": "array", "items": {"type": "string"}},
                    "punktzahl": {"type": "integer"},
                    "kategorien": {
                        "type": "object",
                        "properties": {
                            "bestaetigt": {"type": "string"},
                            "verneint": {"type": "string"},
                        },
                        "required": ["bestaetigt", "verneint"],
                        "additionalProperties": False,
                    },
                },
                "required": [
                    "art",
                    "frage_text",
                    "richtige_antworten",
                    "falsche_antworten",
                    "punktzahl",
                ],
                "if": {"properties": {"art": {"const": "K"}}},
                "then": {"required": ["kategorien"]},
                "else": {"not": {"required": ["kategorien"]}},
            },
        },
    },
    "required": ["titel", "beschreibung", "fragen"],
}
