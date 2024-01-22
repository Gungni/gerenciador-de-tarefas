# gerenciador-de-tarefas
Documentação do Projeto
Aplicativo de Gerenciamento de Tarefas - Akhasic

Requisitos
1. Criação de Tarefas:
- Os usuários podem criar tarefas especificando um título, prioridade, responsável, data de
vencimento, descrição e checklist.
2. Edição de Tarefas:
- Os usuários podem editar tarefas existentes, incluindo a capacidade de modificar título,
prioridade, responsável, data de vencimento, descrição e checklist, além da possibilidade de
exclusão da tarefa.
3. Conclusão de Tarefas:
- Os usuários podem marcar uma tarefa como concluída, movendo-a para a seção de
tarefas concluídas.
4. Modal de Edição:
- Um modal de edição é apresentado aos usuários para facilitar a edição de tarefas.
5. Armazenamento Local:
- As tarefas criadas e as tarefas concluídas são armazenadas localmente no navegador
do usuário usando o localStorage.
6. Download de Tarefas:
- Os usuários podem baixar todas as tarefas, incluindo as concluídas, em formato JSON.
7. Limpeza do Armazenamento Local:
- Os usuários têm a opção de limpar todas as tarefas armazenadas localmente, com uma
confirmação antes da ação.
Funcionalidades
1. Adicionar Tarefa:
- Coleta informações do usuário, cria dinamicamente um elemento HTML representando a
tarefa e a adiciona à lista de tarefas.
2. Editar Tarefa:
- Abre uma modal preenchida com os detalhes da tarefa selecionada para permitir a
edição dos campos.
3. Salvar Alterações:
- Salva as alterações feitas em uma tarefa editada e atualiza a exibição.
4. Excluir tarefa:
- exclui determinada tarefa.
5. Concluir Tarefa:
- Move uma tarefa da lista de tarefas para a lista de tarefas concluídas.
6. Exportar Tarefas:
- Cria um arquivo JSON contendo as informações de todas as tarefas, permitindo o
download.
7. Limpar Tarefas:
- Limpa todas as tarefas armazenadas localmente, proporcionando uma confirmação do
usuário.
8. Carregar Tarefas do Armazenamento Local:
- Ao carregar a página, recupera as tarefas armazenadas localmente e as exibe.
Técnicas Utilizadas
A implementação da aplicação de gerenciamento de tarefas foi realizada por meio de uma
combinação de HTML, CSS e JavaScript.
1. HTML:
- Estruturação da página web.
- Utilização de formulários, divs, botões e elementos semânticos.
2. CSS:
- Estilização da aparência da página.
- Utilização de classes, IDs e seletores para aplicar estilos.
3. JavaScript:
- Manipulação do DOM (Document Object Model).
- Funções para adicionar, editar, concluir e exportar tarefas.
- Uso do localStorage para armazenar dados localmente no navegador.
- Interatividade com eventos do usuário.
Observações Finais
Este projeto de gerenciamento de tarefas oferece uma interface simples e funcionalidades
essenciais para o usuário organizar suas tarefas diárias. A combinação de técnicas de
desenvolvimento web permite uma experiência intuitiva e eficiente no controle das
atividades. Para futuras melhorias, considere a adição de recursos adicionais, como
notificações e categorização de tarefas
