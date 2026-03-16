import { APIUtil } from '../../../utils/APIUtil';

const apiUtil = new APIUtil();

test('jsonplaceholder_get: should GET and validate response', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
    });

    await apiUtil.assertStatusOk(response);
    const body = await response.json();
    await apiUtil.saveApiResponse('get_jsonplaceholder', body);
    await apiUtil.assertResponseBodyKeys(['userId', 'id', 'title', 'body'], body as Record<string, any>, 'Response Body');

    // Verify at least content-type header present
    const headersArray: { name: string; value: string }[] = [];
    response.headers.forEach((value, name) => {
        headersArray.push({ name, value });
    });
    await apiUtil.assertResponseHeaders('content-type', headersArray, 'Response Headers');
});
