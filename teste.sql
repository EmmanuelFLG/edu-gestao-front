--- 1. CRIAR OS CARGOS (ROLES)
INSERT INTO roles (nome) VALUES ('ALUNO');
INSERT INTO roles (nome) VALUES ('PROFESSOR');

--- 2. CRIAR O PROFESSOR MARCOS
-- Inserir na tabela pai (usuarios)
-- Senha: 123456
INSERT INTO usuarios (nome, email, senha) 
VALUES ('Marcos Silva', 'marcos@escola.com', '$2a$10$8.UnVuG9HHgU3OnW.6Zqgetz3IQ8iVYvAdMnvfICK5dPZOnhqeK3i');

-- Inserir na tabela filha (professores) 
-- (O ID aqui deve ser o mesmo gerado em usuarios, geralmente 1)
INSERT INTO professores (id) VALUES (1);

-- Vincular Marcos à Role de PROFESSOR (ID da Role PROFESSOR é 2)
INSERT INTO usuario_roles (usuario_id, role_id) VALUES (1, 2);


--- 3. CRIAR O ALUNO LUAN
-- Inserir na tabela pai (usuarios)
-- Senha: 123456
INSERT INTO usuarios (nome, email, senha) 
VALUES ('Luan Gabriel', 'luan@escola.com', '$2a$10$8.UnVuG9HHgU3OnW.6Zqgetz3IQ8iVYvAdMnvfICK5dPZOnhqeK3i');

-- Inserir na tabela filha (alunos)
-- (O ID aqui deve ser o mesmo gerado para o Luan em usuarios, geralmente 2)
INSERT INTO alunos (id, matricula) VALUES (2, 'MATRICULA-2026-001');

-- Vincular Luan à Role de ALUNO (ID da Role ALUNO é 1)
INSERT INTO usuario_roles (usuario_id, role_id) VALUES (2, 1);




--- 1. LIMPEZA PREVENTIVA (Opcional, mas garante que os IDs comecem do 1)
 TRUNCATE TABLE alocacoes, matriculas, horarios, notas, presencas RESTART IDENTITY CASCADE;
 TRUNCATE TABLE disciplinas, turmas RESTART IDENTITY CASCADE;

--- 1. DISCIPLINAS
INSERT INTO disciplinas (nome, cargahoraria, ativa) 
VALUES ('Matemática', 80, true);

--- 2. TURMAS
INSERT INTO turmas (nome, serie, curso, turno, anoletivo) 
VALUES ('3º A', '3º Ano', 'Ensino Médio', 'MANHÃ', '2026');

--- 3. ALOCAÇÕES
-- Professor ID 1 (Marcos), Disciplina ID 1 (Matemática), Turma ID 1 (3º A)
INSERT INTO alocacoes (professor_id, disciplina_id, turma_id) 
VALUES (1, 1, 1);

--- 4. HORÁRIOS (Corrigido para diasemana, horainicio, horafim, aulanumero)
INSERT INTO horarios (diasemana, horainicio, horafim, sala, aulanumero, ativo, alocacao_id)
VALUES ('SEGUNDA', '07:00:00', '07:50:00', 'Sala 05', 1, true, 1);

--- 5. MATRÍCULAS
-- Aluno ID 2 (Luan), Turma ID 1 (3º A)
INSERT INTO matriculas (aluno_id, turma_id, anoletivo, ativa) 
VALUES (2, 1, '2026', true);

--- 6. NOTAS (Corrigido para matricula_id e disciplina_id que são @JoinColumn)
INSERT INTO notas (bimestre, n1, n2, n3, matricula_id, disciplina_id)
VALUES (1, 0.0, 0.0, 0.0, 1, 1);