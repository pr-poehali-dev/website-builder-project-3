import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Редактирует структуру сайта на основе команды пользователя в чате через RouterAI."""

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
    message = body.get('message', '').strip()
    site = body.get('site')

    if not message:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Сообщение не передано'}),
        }

    if not site:
        return {
            'statusCode': 400,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Текущая структура сайта не передана'}),
        }

    api_key = os.environ['ROUTERAI_API_KEY']

    system_prompt = """Ты — AI-редактор сайтов. Тебе дают текущую структуру сайта в формате JSON и просьбу пользователя, что изменить.

Верни ТОЛЬКО валидный JSON без markdown, без ```json, без пояснений — обновлённую структуру сайта целиком, в ТОМ ЖЕ формате:
{
  "name": "Название сайта",
  "tagline": "Короткий слоган",
  "palette": "тёплая|холодная|нейтральная|яркая",
  "sections": [
    {"tag": "Название секции", "description": "Что будет в этой секции"}
  ]
}

Внеси только те изменения, которые просит пользователь. Остальное оставь без изменений. Если пользователь просит добавить секцию — добавь. Если просит убрать — убери. Если просит поменять текст, название, слоган или палитру — поменяй. Названия секций и тексты — на русском языке."""

    user_content = f"Текущая структура сайта:\n{json.dumps(site, ensure_ascii=False)}\n\nЗапрос пользователя: {message}"

    request_data = json.dumps({
        'model': 'google/gemini-2.5-flash',
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': user_content},
        ],
        'max_tokens': 1536,
        'temperature': 0.6,
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
