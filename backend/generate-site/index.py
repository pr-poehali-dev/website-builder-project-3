import json
import os
import urllib.request


def handler(event: dict, context) -> dict:
    """Генерирует структуру сайта на основе описания пользователя через GPT-4o."""

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

    api_key = os.environ['OPENAI_API_KEY']

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
Примеры секций: «Шапка с меню», «Главный баннер», «О нас», «Наши услуги», «Галерея работ», «Отзывы клиентов», «Форма заявки», «Контакты и карта».
"""

    full_prompt = f"{system_prompt}\n\nСоздай структуру сайта: {prompt}"

    request_data = json.dumps({
        'model': 'gpt-4o-mini',
        'input': full_prompt,
        'store': False,
    }).encode('utf-8')

    req = urllib.request.Request(
        'https://api.openai.com/v1/responses',
        data=request_data,
        headers={
            'Authorization': f'Bearer {api_key}',
            'Content-Type': 'application/json',
        },
        method='POST',
    )

    with urllib.request.urlopen(req, timeout=25) as resp:
        result = json.loads(resp.read().decode('utf-8'))

    content = result['output'][0]['content'][0]['text'].strip()
    # Убираем возможные markdown-обёртки
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