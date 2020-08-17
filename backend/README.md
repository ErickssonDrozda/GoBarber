# Recuperação de senha

**RF**

- O usuário deve poder recuperar sua senha informando o seu email.
- O usuário deve receber um email com instruções de recuperação de senha.
- O usuário deve poder resetar sua senha.

**RNF**

- Utilizar Mailtrap para testar envios em ambientes de teste.
- Utilizar Amazon SES para envios em produção.
- O envio de email deve acontecer em segundo plano ( background job ).

**RN**

- O link enviado para resetar a senha deve expirar em 2 horas.
- O usuário precisa confirmar a nova senha ao resetar a nova senha.

# Atualização do perfil

**RF**

- O usuário deve poder atualizar seu perfil: nome, email e senha.

**RNF**

- Não há

**RN**

- O usuário não pode alterar seu email para um usuário ja existente.
- Para atualizar a senha, deve-se inserir a senha antiga.
- Para atualziar a senha, deve-se confirmar a nova senha.

# Painel do prestador

**RF**

- O usuário deve poder listar seus agendamentos de um dia específico.
- O prestador deve receber uma notificação sempre que houver um agendamento.
- O prestador deve poder visualizar as notificações não lidas.

**RNF**

- Os agendamentos do prestador no dia devem ser armazenados em cache.
- As notificações do prestador devem ser armazenadas no mongodb.
- As notificações do prestador devem ser enviadas em tempo real utilizando socket.io

**RN**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar.

# Agendamento de serviço

**RF**

- O usuário deve poder listar todos os prestadores de serviço cadastrados.
- O usuário deve poder listar os dias de um mês com pelo menos um horário disponível de um prestador específico.
- O usuário deve poder listar horários disponíveis em um dia específico de um prestador.
- O usuário deve poder realizar um novo agendamento com um prestador.

**RNF**

- A listagem de prestadores devem ser armazenadas em cache.

**RN**

- Cada agendamento deve durar 1 hora.
- Os agendamentos devem estar disponíveis entre 08 horas às 18 horas ( primeiro às 08:00 e o último as 17:00 horas ).
- O usuário não pode agendar em um horário já ocupado.
- O usuário não pode agendar em um horário que já passou.
- O usuário não pode agendar serviços consigo mesmo.
