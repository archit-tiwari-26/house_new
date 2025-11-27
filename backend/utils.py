def validate_input(data: dict):
    # Placeholder for validations
    # e.g. check missing fields, invalid types
    return True
def normalize_string(s):
    if not isinstance(s, str):
        return "unknown"
    return s.strip().lower()
