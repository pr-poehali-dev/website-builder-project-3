import json
import os
import urllib.request
import urllib.error


def handler(event: dict, context) -> dict:
    """Генерирует короткий эмпатичный ответ AI на идею сайта пользователя перед выбором стиля."""

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
            'body': json.dumps({'error': 'Описание идеи не передано'}),
        }

    api_key = os.environ['ROUTERAI_API_KEY']

    system_prompt = """Ты — дружелюбный AI-ассистент конструктора сайтов EasySait. Пользователь только что описал идею своего будущего сайта.

Ответь коротко (2-3 предложения, без markdown, без списков и заголовков): покажи, что понял суть идеи, отметь, для кого этот сайт и что в нём будет полезного или интересного. Тон — тёплый, воодушевляющий, экспертный, как будто ты уже представляешь готовый продукт.
Не задавай вопросов, не предлагай шаблоны и не упоминай стиль дизайна — просто дай эмпатичную реакцию на саму идею."""

    request_data = json.dumps({
        'model': 'google/gemini-2.5-flash',
        'messages': [
            {'role': 'system', 'content': system_prompt},
            {'role': 'user', 'content': prompt},
        ],
        'max_tokens': 200,
        'temperature': 0.8,
    }).encode('utf-8')

    url = 'https://routerai.ru/api/v1/chat/completions'

    req = urllib.request.Request(
        url,
        data=request_data,
        headers={'Content-Type': 'application/json', 'Authorization': f'Bearer {api_key}'},
        method='POST',
    )

    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            result = json.loads(resp.read().decode('utf-8'))
    except urllib.error.HTTPError as e:
        error_body = e.read().decode('utf-8')
        print(f'RouterAI error {e.code}: {error_body}')
        return {
            'statusCode': 502,
            'headers': {'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': f'RouterAI {e.code}: {error_body}'}),
        }

    reply = result['choices'][0]['message']['content'].strip()

    return {
        'statusCode': 200,
        'headers': {'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json'},
        'body': json.dumps({'reply': reply}, ensure_ascii=False),
    }
