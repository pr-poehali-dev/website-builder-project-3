import json
import os
import urllib.request
import urllib.error
# deploy v2


def handler(event: dict, context) -> dict:
    """Генерирует структуру сайта на основе описания пользователя через Anthropic Claude."""

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

    api_key = os.environ['ROUTERAI_API_KEY']

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
        'model': 'google/gemini-2.5-flash',
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': f'Создай структуру сайта: {prompt}'},
        ],
        'max_tokens': 1024,
        'temperature': 0.7,
    }).encode('utf-8')

    url = 'https://routerai.ru/api/v1/chat/completions'

    req = urllib.request.Request(
        url,
        data=request_data,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'},
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f'RouterAI error {e.code}: {error_body}')
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'RouterAI {e.code}: {error_body}'}),
        }

    content = result['choices'][0]['message']['content'].strip()
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