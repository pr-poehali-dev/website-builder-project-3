import json
import os
import urllib.request


def handler(event: dict, context) -> dict:
    """Генерирует структуру сайта на основе описания пользователя через Claude Opus 4."""

    if event.get('httpMethod') == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400',
            },
            'body': '',
        }

    body = json.loads(event.get('body') or '{}')
    prompt = body.get('prompt', '').strip()

    if not prompt:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Описание сайта не передано'}),
        }

    api_key = os.environ['ANTHROPIC_API_KEY']

    system_prompt = """Ты — AI-конструктор сайтов. Пользователь описывает сайт, ты возвращаешь JSON со структурой.

Верни ТОЛЬКО валидный JSON без markdown, без ```json, без пояснений.

Формат:
{
  "name": "Название сайта",
  "tagline": "Короткий слоган (до 10 слов)",
  "palette": "тёплая|холодная|нейтральная|яркая",
  "sections": [
    {"tag": "Название секции", "description": "Что будет в этой секции (1 предложение)"}
  ]
}

Секций должно быть от 4 до 7. Названия секций — на русском языке, конкретные и понятные.
Примеры секций: «Шапка с меню», «Главный баннер», «О нас», «Наши услуги», «Галерея работ», «Отзывы клиентов», «Форма заявки», «Контакты и карта»."""

    request_data = json.dumps({
        'model': 'claude-opus-4-5',
        'max_tokens': 1024,
        'system': system_prompt,
        'messages': [
            {'role': 'user', 'content': f'Создай структуру сайта: {prompt}'}
        ],
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.anthropic.com/v1/messages',
        data=request_data,
        headers={
            'x-api-key': api_key,
            'anthropic-version': '2023-06-01',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    content = result['content'][0]['text'].strip()
    if content.startswith('```'):
        content = content.split('```')[1]
        if content.startswith('json'):
            content = content[4:]
    site_data = json.loads(content.strip())

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps(site_data, ensure_ascii=False),
    }