# Instale o Python

https://www.python.org/ftp/python/3.13.2/python-3.13.2-amd64.exe

# Instale o Node

https://nodejs.org/dist/v22.14.0/node-v22.14.0-x64.msi

# Instale os requirements

pip install -r requirements.txt

# Instale o Yarn e Axios

npm install yarn (Caso der erro no Windows, execute Set-ExecutionPolicy Unrestricted -Scope CurrentUser como adm no powershell)
npm install axios

# Para rodar o front-end execute esses dois comandos

yarn install
yarn start

# Para rodar o back-end execute o app.py e o seguinte comando

uvicorn app:app
