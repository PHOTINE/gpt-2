from starlette.applications import Starlette
from starlette.responses import UJSONResponse

import uvicorn
import os
import gc

from src.interactive_conditional_samples import interact_model

app = Starlette(debug=False)

# Needed to avoid cross-domain issues
response_header = {
    'Access-Control-Allow-Origin': '*'
}

generate_count = 0


@app.route('/', methods=['GET', 'POST', 'HEAD'])
async def homepage(request):
    # global generate_count
    # global sess

    if request.method == 'GET':
        params = request.query_params
    elif request.method == 'POST':
        params = await request.json()
    elif request.method == 'HEAD':
        return UJSONResponse({'text': ''},
                             headers=response_header)

    text = interact_model(
        input_text=params.get('input_text', 'The quick brown fox'),
        model_name='124M',
        seed=None,
        nsamples=1,
        batch_size=1,
        length=params.get('length', 128),
        temperature=float(params.get('temperature', 0.7)),
        top_k=int(params.get('top_k', 0)),
        top_p=float(params.get('top_p', 0)),
        models_dir='models',
    )

    gc.collect()
    return UJSONResponse({'text': text},
                         headers=response_header)

if __name__ == '__main__':
    uvicorn.run(app, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))