
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import argostranslate.translate

app = FastAPI()


class TranslationRequest(BaseModel):
    texts: list[str]


@app.post("/translate")
def translate_texts(request: TranslationRequest):
    try:
        translations = [
            argostranslate.translate.translate(text, "en", "pt")
            for text in request.texts
        ]

        return {"translations": translations}

    except Exception as error:
        raise HTTPException(
            status_code=500,
            detail="Não foi possível traduzir os textos."
        ) from error
