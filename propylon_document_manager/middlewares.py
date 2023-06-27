from rest_framework.exceptions import AuthenticationFailed
from rest_framework.authtoken.models import Token

class TokenMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        token = self.get_token_from_header(request)
        request.token = token  # Attach the token to the request object
        return self.get_response(request)

    @staticmethod
    def get_token_from_header(request):
        authorization_header = request.headers.get('Authorization')
        if authorization_header:
            try:
                token = authorization_header.split(' ')[1]  # Remove the "Token " prefix from the token string
                token_obj = Token.objects.get(key=token)
                request.user_id = token_obj.user_id
                return token
            except IndexError:
                raise AuthenticationFailed('Invalid token')
        else:
            pass
