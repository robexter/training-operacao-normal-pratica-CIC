'use strict';

const APP_NAME = 'training operacao normal pratica CIC';
const STORAGE_KEY = 'training-operacao-normal-pratica-cic-v3';
const LEGACY_STORAGE_KEYS = ['training-operacao-normal-pratica-cic-v2'];
const APP_VERSION = 'V3.1.1 · Sala CIC + instalação PWA';

const DIM_LABELS = { safety:'Segurança', stability:'Estabilidade', procedure:'Procedimento', coordination:'Coordenação' };

const S = (id,title,category,difficulty,focus,source,summary,initialState,steps) => ({id,title,category,difficulty,focus,source,summary,initialState,steps});
const O = (text,quality,feedback,consequence,effects={},critical=false) => ({text,quality,feedback,consequence,effects,critical});
const E = (safety=0,stability=0,procedure=0,coordination=0) => ({safety,stability,procedure,coordination});

const SCENARIOS = [
S('press-01','Preparação da transferência para a PDV-39027C','Pressão do regenerador','Avançado','Prontidão + teste de operacionalidade','PE.REF.OPE.CCF.063 §5.2.1.1–1.3','O controle ainda está nas L-3903 A1/A2. A equipe pretende devolver a pressão do D-3904 à PDV-39027C com o menor distúrbio possível.',[
 ['Pressão D-3904','estável','stable'],['PDV-39027C','fora do controle','stable'],['PIC-39028','AUTO','stable'],['Risco','nuvem de catalisador','up']
],[
 {prompt:'Qual condição deve ser confirmada antes de iniciar a transferência?',context:'A manobra já foi comunicada às áreas envolvidas.',options:[
  O('Testar a operacionalidade da PDV-39027C via PIC-39027 ou PIC-39026 e só prosseguir se ela estiver modulando.','correct','O procedimento exige o teste de operacionalidade antes da transferência.','A válvula está comprovadamente responsiva antes de assumir a pressão.',E(2,3,3,2)),
  O('Confirmar apenas que a bomba de óleo está disponível e iniciar a transferência, testando a PDV durante o movimento.','partial','A disponibilidade do óleo é relevante, mas não substitui o teste de modulação antes da transferência.','A manobra começa com incerteza sobre a resposta da válvula.',E(1,0,0,1)),
  O('Levar o PIC-39028 para MANUAL e usar sua MV para testar a PDV-39027C.','wrong','O PIC-39028 deve ser mantido em automático conforme o procedimento; o teste indicado é via PIC-39027/PIC-39026.','A proteção operacional da estratégia de pressão fica descaracterizada.',E(-2,-3,-3,-1),true)
 ]},
 {prompt:'Com a PDV comprovadamente modulante, como preparar PDIC-39029, ZIC-39009 e PIC-39028?',context:'A pressão segue estável nas L-3903.',options:[
  O('Colocar PDIC-39029 e ZIC-39009 em MANUAL; manter PIC-39028 em AUTO, SP 250 g acima da pressão atual e MV em 0%.','correct','Essa é a preparação prescrita para a transferência às PDVs.','Os caminhos ficam preparados sem provocar mudança brusca no controle.',E(2,3,3,2)),
  O('Manter PDIC-39029 em AUTO, colocar ZIC-39009 em MANUAL e igualar o SP do PIC-39028 à pressão atual.','partial','Mistura estados que não correspondem à sequência do padrão.','Pode haver competição de controladores durante a passagem.',E(1,-1,-2,0)),
  O('Colocar os três controladores em MANUAL e abrir preventivamente o ZIC-39009.','wrong','O PIC-39028 deve permanecer em automático com a referência indicada.','Perde-se a estratégia prevista para manter a transferência estável.',E(-2,-3,-3,-1),true)
 ]},
 {prompt:'Antes de mexer nas MVs, o que o operador CIC precisa identificar na tela?',context:'Há mais de um controlador associado à pressão do regenerador.',options:[
  O('Qual controlador está efetivamente controlando a pressão do regenerador naquele momento.','correct','O procedimento traz essa verificação explicitamente.','A próxima ação é baseada na malha que realmente está em controle.',E(1,3,3,1)),
  O('Somente qual L-3903 apresenta maior posição, pois a pressão seguirá a válvula mais aberta.','partial','A posição ajuda no diagnóstico, mas não substitui identificar o controlador em serviço.','A leitura da estratégia de controle fica incompleta.',E(0,0,-1,0)),
  O('Inferir o controlador ativo comparando somente as posições de ZIC-39009 e PDIC-39029, sem confirmar na tela qual malha está efetivamente em controle.','wrong','A identificação do controlador é necessária para uma transferência sem salto.','A mudança pode ser executada contra uma malha ativa não reconhecida.',E(-1,-3,-2,-1))
 ]}
]),
S('press-02','Transferência suave L-3903 → PDV-39027C','Pressão do regenerador','Avançado','Tracking de MV + troca sem bump','PE.REF.OPE.CCF.063 §5.2.1.4–1.6','A PDV-39027C está automática e pronta. Agora o CIC precisa transferir efetivamente a responsabilidade de controle.',[
 ['Pressão D-3904','estável','stable'],['PDIC-39029','MANUAL','stable'],['ZIC-39009','MANUAL','stable'],['PIC-39027 MV','baixa','stable']
],[
 {prompt:'Qual é a primeira equalização importante antes de reduzir o caminho pelas L-3903?',context:'O objetivo é evitar salto de saída na malha.',options:[
  O('Igualar a MV do PDIC-39027 com a PV do PIC-39027.','correct','O padrão determina essa equalização antes da transferência progressiva.','O novo caminho parte rastreado em relação ao controlador de pressão.',E(1,3,3,1)),
  O('Igualar a MV do PIC-39028 com a PV do PDIC-39029.','wrong','Essa não é a equalização indicada no procedimento.','O controlador que assumirá a PDV permanece sem tracking adequado.',E(-1,-3,-3,0)),
  O('Igualar somente os set-points dos dois PICs e manter as MVs como estão.','partial','Igualar set-points não substitui a equalização MV/PV prevista.','Ainda pode existir descontinuidade no sinal manipulado.',E(0,-2,-1,0))
 ]},
 {prompt:'Como conduzir o fechamento do caminho pelas L-3903?',context:'A PDV-39027C começa a abrir enquanto o sistema anterior deve ser retirado gradualmente.',options:[
  O('Reduzir gradativamente a MV do PDIC-39029, acompanhar a abertura da PDV-39027C, aguardar MV do PIC-39027 >50%, e reduzir também ZIC-39009 até zerar as MVs.','correct','A sequência coordena o ganho de autoridade da PDV com a retirada lenta das L-3903.','A pressão permanece com mínimo distúrbio.',E(2,3,3,2)),
  O('Zerar primeiro ZIC-39009 e PDIC-39029; depois abrir a PDV até recuperar a pressão.','wrong','Zerar antes da PDV assumir cria perda abrupta de capacidade de controle.','A pressão do regenerador tende a se deslocar durante a recuperação.',E(-2,-3,-3,-1),true),
  O('Manter ZIC-39009 fixo e reduzir PDIC-39029 rapidamente até 0%, deixando a PDV compensar.','partial','A manobra deve ser lenta e coordenada; o procedimento também reduz ZIC-39009.','A PDV precisa compensar um degrau desnecessário.',E(0,-2,-2,0))
 ]},
 {prompt:'Quando finalizar a troca para o novo arranjo?',context:'As MVs anteriores chegaram a zero e a PDV já assumiu a pressão.',options:[
  O('Colocar o PDIC-39027 em automático e confirmar estabilidade antes de considerar a transferência concluída.','correct','É a finalização prevista da transferência para a PDV.','A estratégia de pressão fica restabelecida no modo normal planejado.',E(1,3,3,2)),
  O('Manter o PDIC-39027 em MANUAL por todo o turno para evitar que ele altere a PDV.','wrong','O procedimento prevê retorno do PDIC-39027 ao automático.','A operação permanece dependente de atuação manual do CIC.',E(0,-2,-3,-1)),
  O('Colocar PDIC-39029 novamente em AUTO antes do PDIC-39027.','partial','Isso reintroduz o caminho retirado da transferência.','Pode haver disputa entre estratégias.',E(0,-2,-2,0))
 ]}
]),
S('press-03','Transferência PDV-39027C → L-3903','Pressão do regenerador','Avançado','Retirada coordenada da PDV','PE.REF.OPE.CCF.063 §5.2.2.2–2.7','A pressão está na PDV-39027C. A condição operacional requer transferir o controle para as L-3903 A1/A2.',[
 ['PDV-39027C','em controle','stable'],['PDIC-39027','AUTO','stable'],['PIC-39028','AUTO','stable'],['L-3903','disponíveis','stable']
],[
 {prompt:'Qual preparação de controle é correta?',context:'A equipe já foi avisada sobre a manobra.',options:[
  O('ZIC-39009 e PDIC-39029 em MANUAL; PIC-39028 em AUTO com SP 250 g acima da pressão atual e MV 0%.','correct','Corresponde à sequência prescrita.','Os caminhos pelas L-3903 ficam disponíveis sem assumir prematuramente.',E(2,3,3,2)),
  O('PDIC-39029 em AUTO, ZIC-39009 em MANUAL, PIC-39028 em MANUAL com MV 0%.','wrong','Os modos não seguem o procedimento de transferência.','A troca começa com estratégia diferente da prevista.',E(-1,-3,-3,0)),
  O('ZIC-39009 e PDIC-39029 em MANUAL, PIC-39028 AUTO com SP igual à pressão atual.','partial','Falta a margem de 250 g indicada no procedimento.','A referência de proteção fica diferente do padrão.',E(0,-1,-2,0))
 ]},
 {prompt:'Como retirar o PDIC-39027 da função de controle antes de fechar a PDV?',context:'A pressão ainda está estabilizada pela PDV-39027C.',options:[
  O('Retirar PDIC-39027 de automático, permitindo ao PIC-39027 assumir o controle de pressão.','correct','Essa passagem é explicitamente prevista antes do fechamento da PDV.','O controlador de pressão continua sustentando a variável enquanto a estratégia muda.',E(1,3,3,1)),
  O('Fechar primeiro a PDV-39027C e depois passar PDIC-39027 para MANUAL.','wrong','A sequência inverte a lógica do procedimento.','A pressão perde o caminho controlado antes da transferência.',E(-2,-3,-3,-1),true),
  O('Manter ambos em AUTO e apenas reduzir o SP do PDIC-39027.','partial','A estratégia não é a prevista e pode manter competição entre sinais.','O fechamento deixa de ser uma transferência controlada.',E(0,-2,-2,0))
 ]},
 {prompt:'Durante o fechamento da PDV-39027C, qual atuação é coerente?',context:'A pressão do regenerador deve sofrer o mínimo distúrbio possível.',options:[
  O('Fechar a PDV progressivamente e abrir lentamente/alternadamente ZIC-39009 e PDIC-39029 observando continuamente a pressão.','correct','É a ação indicada para transferir capacidade de controle sem degrau.','As L-3903 absorvem a função à medida que a PDV sai.',E(2,3,3,2)),
  O('Fechar a PDV de uma vez e, após a resposta da pressão, abrir simultaneamente ZIC e PDIC até recuperar o valor.','wrong','A manobra deve ser lenta e acompanhada.','Produz uma perturbação evitável no conversor.',E(-2,-3,-3,-1),true),
  O('Manter a PDV em posição fixa e abrir somente ZIC-39009 até a pressão começar a subir.','partial','O padrão coordena ZIC e PDIC e prevê fechamento total da PDV.','A distribuição de atuação fica incompleta.',E(0,-2,-2,0))
 ]},
 {prompt:'Com a PDV totalmente fechada, qual tracking deve ser feito?',context:'A troca de controlador precisa terminar sem um novo salto.',options:[
  O('Retirar o PIC-39027 do controle e colocar a MV do PDIC-39027 300 g acima da PV do PIC-39027.','correct','Esse valor aparece no procedimento após o fechamento da PDV.','O controlador fica posicionado para a nova condição sem reabrir a PDV indevidamente.',E(1,2,3,1)),
  O('Colocar imediatamente PDIC-39027 em AUTO com MV igual a 0%.','wrong','O procedimento orienta retirar PIC e posicionar a MV 300 g acima da PV.','Pode ocorrer ação inesperada da malha.',E(-1,-2,-3,0)),
  O('Manter o PIC-39027 controlando e automatizar PDIC-39029 sem qualquer ajuste de tracking.','partial','Ainda falta o ajuste específico do PDIC-39027.','A transferência fica incompleta.',E(0,-1,-2,0))
 ]}
]),
S('press-04','Distúrbio durante a transferência de pressão','Pressão do regenerador','Especialista','Reconhecimento precoce + comunicação','PE.REF.OPE.CCF.063 §5.3','Durante a troca de controle, a pressão começa a oscilar e há potencial de arraste/emissão de catalisador pela chaminé da GV-3901.',[
 ['Pressão D-3904','oscilando','up'],['Transferência','em andamento','down'],['GV-3901','risco de nuvem','up'],['Comunicação','ativa','stable']
],[
 {prompt:'Qual princípio deve governar a atuação do CIC?',context:'A manobra ainda pode ser controlada, mas o distúrbio aumentou.',options:[
  O('Reduzir a velocidade da transferência, estabilizar a pressão e manter as partes envolvidas informadas.','correct','O item crítico do padrão é evitar nuvem de catalisador fazendo a manobra lentamente e comunicando as partes.','A transferência deixa de perseguir velocidade e passa a priorizar estabilidade.',E(3,3,3,3)),
  O('Acelerar a transferência para reduzir o tempo exposto à condição intermediária.','wrong','O padrão orienta exatamente o contrário: manobra lenta e comunicada.','A oscilação e o risco de emissão podem aumentar.',E(-3,-3,-3,-2),true),
  O('Manter a velocidade planejada da transferência e usar a malha que está assumindo para compensar o desvio, sem interromper a progressão.','wrong','Alarmes não devem ser tratados como ruído quando a variável está instável.','O operador perde indicações relevantes durante a transferência.',E(-3,-2,-2,-1),true)
 ]},
 {prompt:'A pressão continua afastando-se da condição estável. O que fazer antes de novas mudanças de modo?',context:'Ainda existe autoridade nos caminhos de controle em uso.',options:[
  O('Interromper a progressão, usar a configuração ainda disponível para estabilizar e reavaliar a sequência com o supervisor/equipe.','correct','É coerente com o objetivo explícito de mínimo distúrbio e com a gestão de anomalias.','A variável é estabilizada antes de introduzir outra mudança.',E(3,3,2,3)),
  O('Trocar simultaneamente todos os controladores para AUTO, esperando que o sistema selecione a melhor saída.','wrong','A transferência depende de estados definidos, tracking e sequência.','Pode ocorrer competição de malhas e novo degrau.',E(-2,-3,-3,-1),true),
  O('Congelar todas as MVs e aguardar a pressão retornar sem intervenção.','partial','Pode ser adequado pausar a progressão, mas a estabilização requer acompanhamento/atuação e reavaliação.','A resposta fica passiva diante de uma variável crítica.',E(1,-1,0,1))
 ]},
 {prompt:'O que caracteriza uma boa conclusão operacional da ocorrência?',context:'A pressão foi recuperada.',options:[
  O('Confirmar malha efetivamente controlando, modos/MVs coerentes, estabilidade sustentada e comunicar a condição final.','correct','Finaliza a manobra com verificação do estado real, não apenas do valor momentâneo.','A equipe sabe qual estratégia ficou em serviço e a condição é rastreável.',E(2,3,3,3)),
  O('Encerrar assim que a pressão cruzar o set-point uma vez.','partial','Um cruzamento pontual não confirma estabilidade sustentada.','Pode haver oscilação residual não reconhecida.',E(0,-2,-1,0)),
  O('Retornar automaticamente à configuração inicial sem verificar qual controlador está ativo.','wrong','A configuração deve ser identificada e coerente com o estado final.','Cria risco de nova perturbação.',E(-1,-3,-2,-1))
 ]}
]),
S('c3954-01','Quando iniciar a retrolavagem do C-3954','C-3954','Intermediário','Diagnóstico + pré-requisitos','PE.REF.OPE.CCF.064 §5.2.1.1–1.4','A operação do condensador de superfície mostra perda de desempenho. O CIC precisa decidir se a manobra é necessária e se pode ser iniciada.',[
 ['TI-39817','45 °C','up'],['PI-39866A','-0,62 kgf/cm²','down'],['Maré','alta','stable'],['G-3910','lavagem a confirmar','stable']
],[
 {prompt:'Qual leitura sustenta a necessidade de retrolavagem conforme o padrão?',context:'Considere as indicações de temperatura e vácuo do condensador.',options:[
  O('TI-39817/39871 ≥45 °C e/ou vácuo PI-39866A a partir de -0,62 kgf/cm².','correct','Essas condições são usadas no procedimento para indicar necessidade da manobra.','O diagnóstico é ancorado nas variáveis explicitamente definidas.',E(1,3,3,1)),
  O('Aguardar a combinação de TI-39817/39871 ≥45 °C com PI-39866A a partir de -0,62 kgf/cm²; uma única condição isolada não justificaria a manobra.','wrong','O trip é um limite muito posterior; a retrolavagem é indicada antes disso.','A intervenção seria postergada até uma condição crítica.',E(-3,-3,-3,0),true),
  O('Usar 45 °C como referência, mas iniciar somente depois que os dois passos apresentarem temperatura elevada simultaneamente.','partial','O procedimento usa 45 °C e/ou o critério de vácuo.','A decisão seria antecipada por um limite não suportado pelo padrão.',E(0,0,-2,0))
 ]},
 {prompt:'Qual condição logística deve ser checada antes da lavagem dos filtros e do C-3954?',context:'O procedimento utiliza a condição da água salgada/maré.',options:[
  O('Maré alta e confirmação de que a U-06 não está executando a mesma manobra.','correct','O procedimento condiciona a lavagem a esses dois fatores.','A manobra respeita a disponibilidade do sistema de água salgada.',E(2,2,3,3)),
  O('Confirmar apenas que há vazão de água salgada suficiente no FQI-39802; executar a lavagem independentemente da condição de maré.','wrong','É o oposto da orientação do padrão.','A condição hidráulica pode ficar desfavorável.',E(-2,-2,-3,-1),true),
  O('Confirmar maré alta, mas prosseguir mesmo se a U-06 estiver executando a mesma manobra, desde que o vácuo do C-3954 esteja estável.','partial','A maré alta é requisito explícito.','Um pré-requisito fica sem confirmação.',E(0,-1,-2,0))
 ]},
 {prompt:'Após lavar os G-3910, quantos filtros devem permanecer operando durante a lavagem do C-3954?',context:'O condensador ainda necessita vazão segura de água.',options:[
  O('Três filtros operando.','correct','O padrão determina manter 3 filtros operando durante a lavagem do condensador.','Mantém-se margem de alimentação de água salgada para a manobra.',E(1,2,3,1)),
  O('Dois filtros operando e dois em reserva desde o início da retrolavagem.','partial','Essa configuração aparece após a manobra; durante a lavagem o padrão pede 3 filtros.','A margem hidráulica durante a manobra fica menor que a prescrita.',E(0,-1,-2,0)),
  O('Quatro filtros em operação, sem possibilidade de isolar um passo.','wrong','Não é a condição estabelecida para execução da retrolavagem.','A manobra de lavagem fica incompatível com a sequência prevista.',E(-1,-1,-2,0))
 ]}
]),
S('c3954-02','Escolha do passo e reserva operacional','C-3954','Avançado','Leitura térmica + margem do J-3901','PE.REF.OPE.CCF.064 §5.2.1.5 Obs.2–5','Com os pré-requisitos atendidos, o CIC precisa definir por qual passo iniciar e avaliar se existe folga operacional para prosseguir.',[
 ['TI-39817','mais alto','up'],['TI-39871','mais baixo','stable'],['Parcializadoras J-3901','88%','up'],['Vácuo','-0,61 kgf/cm²','down']
],[
 {prompt:'Como identificar qual passo está mais sujo?',context:'As temperaturas de saída de água salgada dos dois passos estão diferentes.',options:[
  O('Comparar TI-39817 e TI-39871; iniciar pelo passo associado à pior condição, lembrando que o Passo II tem menor área de troca.','correct','É a orientação do procedimento para definir a sequência.','A lavagem começa no passo com maior evidência de perda térmica.',E(1,3,3,1)),
  O('Priorizar o Passo II por possuir menor área de troca, mesmo que a comparação TI-39817/TI-39871 indique o Passo I como mais degradado.','wrong','O padrão manda avaliar qual passo está mais sujo.','Pode-se retirar o passo errado de serviço primeiro.',E(0,-2,-3,0)),
  O('Usar a maior temperatura de saída como critério, mas sem considerar na interpretação que o Passo II possui menor área de troca.','partial','A pressão é relevante ao sistema, mas o padrão usa os TIs para essa decisão.','O diagnóstico não segue o critério estabelecido.',E(0,-1,-2,0))
 ]},
 {prompt:'Parcializadoras de vapor estão >85% e o vácuo está na faixa de -0,62 kgf/cm². Qual estratégia é prevista?',context:'A margem do J-3901 e dos C-3901A/B está reduzida.',options:[
  O('Reduzir a carga da unidade para uma condição compatível com a folga operacional do J-3901 e dos C-3901A/B.','correct','O procedimento pede redução de carga nessas condições para preservar continuidade operacional.','A manobra ganha reserva antes de retirar capacidade de troca.',E(3,3,3,2)),
  O('Prosseguir sem redução, pois o trip de vácuo ainda está distante.','wrong','A recomendação de reduzir carga ocorre bem antes do trip.','A retirada de um passo pode consumir a margem restante.',E(-3,-3,-3,-1),true),
  O('Aumentar a rotação do J-3901 e manter a carga, compensando a perda de vácuo.','wrong','Essa ação não é indicada pelo procedimento de retrolavagem.','Pode elevar a exigência da máquina em condição já limitada.',E(-2,-3,-2,0))
 ]},
 {prompt:'Qual variável deve permanecer sob vigilância contínua durante toda a manobra?',context:'A sequência de válvulas do campo será feita por etapas.',options:[
  O('Vácuo do C-3954 em PI-39866/PI-39866A, além da vazão total FQI-39802.','correct','O procedimento reforça monitoramento contínuo do vácuo e verificação de vazão pelo CIC.','O painel consegue abortar cedo uma tendência desfavorável.',E(3,3,3,2)),
  O('Monitorar continuamente o PI-39866A, mas deixar o FQI-39802 para conferência somente depois de concluído cada passo.','wrong','A posição correta não garante desempenho do condensador.','Uma queda de vácuo pode avançar sem resposta.',E(-2,-3,-2,0),true),
  O('Acompanhar PI-39866A e PI-39833 continuamente, deixando a vazão total FQI-39802 apenas para a normalização final.','wrong','O vácuo deve ser monitorado durante toda a manobra.','Perde-se o principal critério de retorno à condição anterior.',E(-3,-3,-3,0),true)
 ]}
]),
S('c3954-03','Isolamento progressivo do Passo I','C-3954','Avançado','Autorização do CIC por tendência','PE.REF.OPE.CCF.064 §5.2.1.5','O Passo I é o mais sujo. O campo abre totalmente o caminho do Passo II e começa a reduzir as MCVs do Passo I.',[
 ['Passo II','100% disponível','stable'],['Passo I','reduzindo a 20%','down'],['PI-39866','estável','stable'],['CIC','avaliando vácuo','stable']
],[
 {prompt:'Ao atingir aproximadamente 20% nas MCVs do Passo I, qual é a ação correta?',context:'Ainda não houve queda significativa de vácuo.',options:[
  O('Campo solicita ao controlador do CIC avaliação do vácuo e só conclui o fechamento total após liberação.','correct','O padrão estabelece explicitamente essa confirmação do CIC antes do fechamento total.','A retirada do passo é condicionada à resposta real do processo.',E(3,3,3,3)),
  O('Fechar diretamente até 0%, pois a parada em 20% é apenas referência mecânica.','wrong','A parada serve para avaliação do vácuo antes da retirada total.','Pode ocorrer perda abrupta de vácuo sem margem para retorno.',E(-3,-3,-3,-2),true),
  O('Manter permanentemente 20% e iniciar a retrolavagem sem isolar completamente o passo.','partial','A sequência prevê avaliação e, se liberado, fechamento total antes da retrolavagem.','A configuração de lavagem fica incompleta.',E(0,-1,-2,0))
 ]},
 {prompt:'Durante a redução das MCVs, PI-39866 mostra tendência de queda. O que o CIC deve orientar?',context:'A queda começa antes do fechamento total.',options:[
  O('Parar a progressão e retornar as válvulas à condição anterior para reavaliação.','correct','Essa é a resposta indicada nas notas do procedimento.','A perda de vácuo é contida antes de comprometer a unidade.',E(3,3,3,3)),
  O('Concluir rapidamente o fechamento para iniciar a retrolavagem e recuperar a troca térmica.','wrong','Não se deve avançar com vácuo deteriorando.','A unidade pode caminhar para trip de vácuo.',E(-3,-3,-3,-2),true),
  O('Esperar o PI-39866 atingir o valor de trip para então retornar as válvulas.','wrong','O retorno é pela tendência de queda, não apenas pelo trip.','A margem operacional seria consumida desnecessariamente.',E(-3,-3,-3,-1),true)
 ]},
 {prompt:'Com vácuo estável e liberação do CIC, qual é a sequência de lavagem?',context:'O Passo I já pode ser retirado do serviço de água normal.',options:[
  O('Fechar totalmente as MCVs do passo e abrir simultaneamente entrada/retorno de retrolavagem a 100%, mantendo a lavagem por 20 min.','correct','É a sequência descrita para o Passo I.','O passo fica corretamente configurado para a lavagem temporizada.',E(2,2,3,2)),
  O('Abrir primeiro a retrolavagem e depois fechar gradualmente as MCVs normais para evitar choque hidráulico.','partial','A preocupação é plausível, mas não é a sequência estabelecida no procedimento.','Pode haver caminhos simultâneos não previstos.',E(0,-1,-2,0)),
  O('Manter as MCVs normais 20% abertas durante os 20 minutos.','wrong','Após liberação, o padrão prevê fechamento total das MCVs normais.','O fluxo de retrolavagem fica desviado/diluído.',E(-1,-2,-3,0))
 ]}
]),
S('c3954-04','Retorno do C-3954 à condição normal','C-3954','Avançado','Validação pós-manobra','PE.REF.OPE.CCF.064 §5.2.1.6–1.7','Os dois passos foram retrolavados. O foco agora é devolver o condensador ao arranjo operacional e confirmar desempenho.',[
 ['Lavagem','concluída','stable'],['PI-39833','1,1 kgf/cm²','stable'],['FQI-39802','160.000 m³/d','stable'],['Vácuo','recuperado','stable']
],[
 {prompt:'Que verificação de painel confirma condição hidráulica coerente após a manobra?',context:'As válvulas estão retornando para operação normal.',options:[
  O('PI-39833 entre 0,6 e 1,7 kgf/cm² e FQI-39802 em torno de ±160.000 m³/d, além do vácuo estável.','correct','Esses valores aparecem no controle do item crítico pós-manobra.','A normalização é confirmada por pressão, vazão e vácuo.',E(2,3,3,2)),
  O('Confirmar PI-39833 dentro de 0,6–1,7 kgf/cm² e FQI-39802 próximo de 160.000 m³/d, encerrando a checagem sem nova confirmação do vácuo.','wrong','A faixa registrada no procedimento é 0,6 a 1,7 kgf/cm².','Uma pressão elevada seria aceita indevidamente.',E(-1,-2,-3,0)),
  O('Confirmar FQI-39802 e estabilidade do vácuo, deixando a pressão PI-39833 para verificação posterior do campo.','wrong','A validação não deve se limitar a uma variável.','Uma anomalia de vácuo ou pressão pode permanecer oculta.',E(-2,-3,-2,0))
 ]},
 {prompt:'O que fazer com o modo das MCVs após o realinhamento?',context:'As válvulas foram manipuladas localmente/manual durante a retrolavagem.',options:[
  O('Restabelecer o modo remoto/SDCD conforme a condição operacional prevista e conferir coerência de posição.','correct','A manobra deve devolver o sistema ao controle normal após as manipulações locais.','O CIC recupera supervisão/controle coerente do conjunto.',E(2,2,3,2)),
  O('Manter todas em local/manual até a próxima retrolavagem para evitar movimentos automáticos.','wrong','Isso deixa o sistema fora da condição normal de operação.','A disponibilidade de controle remoto fica reduzida.',E(-1,-1,-3,-1)),
  O('Transferir apenas as válvulas de entrada para remoto; saídas podem ficar local.','partial','A normalização deve ser completa e coerente com o arranjo operacional.','Parte do sistema fica fora do controle usual.',E(0,-1,-2,0))
 ]},
 {prompt:'Qual configuração de filtros é indicada ao final, após os ajustes?',context:'A manobra já terminou e a operação estabilizou.',options:[
  O('Manter dois filtros operando e dois em reserva, conforme orientação pós-manobra do procedimento.','correct','O procedimento orienta essa configuração depois da normalização.','O sistema fica com redundância disponível.',E(1,2,3,1)),
  O('Manter os quatro filtros em serviço permanentemente.','partial','Não corresponde à configuração final indicada.','A filosofia de reserva não é restabelecida.',E(0,0,-2,0)),
  O('Manter somente um filtro operando para aumentar a velocidade de lavagem.','wrong','Não é uma condição pós-manobra suportada pelo padrão.','Reduz drasticamente a redundância de água salgada.',E(-2,-2,-3,0))
 ]}
]),
S('j3901-01','Preparação da lavagem do J-3901','Lavagem de turbinas','Avançado','Reserva operacional + instrumentos','PE.REF.OPE.CCF.047 §5.2.1.1–1.4','A lavagem da turbina do soprador J-3901 será iniciada com a unidade em operação. O CIC deve criar margem e garantir qualidade das indicações.',[
 ['Carga U-39','8.000 m³/d','stable'],['Pressão D-3904','1,88 kgf/cm²','stable'],['ΔP descarga J-3901','0,85 kgf/cm²','stable'],['Instrumentos','a validar','stable']
],[
 {prompt:'Quais indicações precisam ser consideradas confiáveis antes de iniciar?',context:'A decisão será feita no painel a partir dessas variáveis.',options:[
  O('CI-39001, PDIC-39028, PDIC-39029, PI-39062A e TI-392052A.','correct','É o conjunto listado na verificação de instrumentação do procedimento do J-3901.','A lavagem começa com referências instrumentais validadas.',E(2,3,3,2)),
  O('Validar PI-39062A, TI-392052A e os PDIC-39028/39029, deixando CI-39001 para acompanhamento após o início da lavagem.','partial','Essas duas são importantes, mas o procedimento lista também CI e os PDICs.','O quadro de controle fica incompleto.',E(0,-1,-2,0)),
  O('Validar CI-39001, PI-39062A e TI-392052A, mas iniciar antes de confirmar a confiabilidade dos PDIC-39028/39029.','wrong','A verificação prévia inclui os controladores e indicadores citados.','A manobra começa sem validar sinais essenciais ao processo.',E(-1,-2,-3,0))
 ]},
 {prompt:'Qual condição de carga e pressão cria a base operacional prevista?',context:'O procedimento prevê redução de carga antes de condicionar a lavagem.',options:[
  O('Reduzir para 7.000 m³/d, controlar pressão do regenerador entre 1,8 e 1,95 kgf/cm² e ajustar ar conforme tabela CENPES.','correct','É a preparação estabelecida para a lavagem do J-3901.','A turbina ganha folga para a redução térmica controlada.',E(2,3,3,2)),
  O('Manter 8.000 m³/d e controlar apenas a pressão do regenerador em 1,95 kgf/cm².','partial','O padrão prevê 7.000 m³/d salvo avaliação específica de folga com as áreas técnicas.','A margem prevista não é criada.',E(0,-2,-2,0)),
  O('Reduzir diretamente para 5.000 m³/d e elevar a pressão acima de 2,0 kgf/cm² para sustentar o ar.','wrong','Esses valores não correspondem ao procedimento.','A unidade é deslocada desnecessariamente da condição especificada.',E(-1,-2,-3,0))
 ]},
 {prompt:'Qual ΔP mínimo de descarga do J-3901 deve ser preservado na preparação?',context:'A carga já está em 7.000 m³/d.',options:[
  O('0,8 kgf/cm².','correct','O procedimento estabelece delta mínimo de 0,8 kgf/cm².','A folga de descarga fica dentro da referência definida.',E(1,2,3,1)),
  O('0,5 kgf/cm².','wrong','É inferior ao delta mínimo indicado.','A máquina ficaria com margem menor que a prevista.',E(-1,-2,-3,0)),
  O('1,8 kgf/cm².','partial','1,8 aparece na faixa de pressão do regenerador, não como delta mínimo de descarga.','Há confusão entre variáveis diferentes.',E(0,-1,-2,0))
 ]}
]),
S('j3901-02','Redução térmica controlada do J-3901','Lavagem de turbinas','Especialista','HBF + patamares + vapor','PE.REF.OPE.CCF.047 §5.2.1.4','O by-pass de vapor ativo foi alinhado. O CIC participa da redução da temperatura do vapor pela injeção de HBF.',[
 ['PI-39062A','39,5 kgf/cm²','stable'],['TI-392052A','310 °C','down'],['Taxa de resfriamento','a definir','stable'],['HBF','início gradual','stable']
],[
 {prompt:'Como a válvula de vapor de 14” deve ser tratada durante a mudança para o by-pass?',context:'O objetivo é preservar a pressão de vapor para a turbina.',options:[
  O('Fechar lentamente, ajustando o sistema para manter PI-39062A entre 39 e 40 kgf/cm².','correct','O procedimento associa o fechamento lento à manutenção dessa faixa de pressão.','A alimentação de vapor muda sem degrau de pressão.',E(2,3,3,2)),
  O('Fechar rapidamente e corrigir a pressão depois pelo by-pass.','wrong','A ação deve ser lenta e acompanhada.','A pressão pode sofrer perturbação brusca.',E(-2,-3,-3,-1),true),
  O('Manter a válvula 14” totalmente aberta e usar apenas HBF para controlar a pressão.','partial','A lavagem prevê alinhamento do by-pass e fechamento progressivo da válvula de alimentação.','A configuração não atinge a condição prevista.',E(0,-1,-2,0))
 ]},
 {prompt:'Qual taxa de redução de temperatura do vapor é prevista ao abrir HBF?',context:'A temperatura está acima do primeiro patamar de avaliação.',options:[
  O('1 °C/min, com avaliações nos patamares previstos antes de continuar a redução.','correct','O procedimento usa 1 °C/min e avaliações progressivas até o patamar final acordado.','O resfriamento ocorre de forma controlada e acompanhada.',E(2,3,3,2)),
  O('Até 9 °C/min, porque esse é o limite térmico da turbina.','wrong','Até 9 °C/min é a taxa de reaquecimento/restabelecimento do J-3901, não de resfriamento.','O resfriamento seria muito mais rápido que o padrão.',E(-2,-3,-3,0),true),
  O('2 °C/min até 250 °C e depois 1 °C/min.','partial','Essa combinação não é a sequência do procedimento.','Introduz uma taxa não prevista na primeira fase.',E(0,-2,-2,0))
 ]},
 {prompt:'O que define se a redução pode continuar nos patamares inferiores?',context:'O processo já alcançou 250 °C.',options:[
  O('Avaliação conjunta das áreas técnicas/operacionais, observando deslocamento axial, pressão de primeiro estágio, condutividade e abertura da governadora.','correct','O procedimento vincula a temperatura de lavagem à coerência desses parâmetros com a desagregação de sílica.','A temperatura não é perseguida isoladamente.',E(3,3,3,3)),
  O('Avançar de patamar quando TI-392052A estabilizar no valor previsto e a pressão de vapor permanecer em 39–40 kgf/cm², sem aguardar a avaliação conjunta dos parâmetros mecânicos/condutividade.','wrong','A temperatura sozinha não define a continuidade.','Sinais mecânicos e de limpeza podem ser ignorados.',E(-2,-2,-3,-1)),
  O('Usar condutividade e deslocamento axial como critérios de avanço, sem considerar pressão do primeiro estágio e abertura da governadora.','partial','A condutividade é um critério, mas não o único citado.','A decisão fica incompleta.',E(0,-1,-2,1))
 ]}
]),
S('j3901-03','Anomalia durante lavagem do J-3901','Lavagem de turbinas','Especialista','Desaceleração + estabilidade da unidade','PE.REF.OPE.CCF.047 §5.2.1.6 Obs.1–2','Durante a lavagem, a turbina apresenta desaceleração. O CIC observa também redução da margem operacional do soprador.',[
 ['Rotação J-3901','caindo','down'],['Carga','7.000 m³/d','stable'],['Vazão de ar','no limite','down'],['Lavagem','em curso','stable']
],[
 {prompt:'Qual resposta está alinhada ao procedimento?',context:'A desaceleração ocorre durante a etapa de limpeza.',options:[
  O('Reduzir a carga da unidade e manter a vazão de ar compatível com a tabela CENPES.','correct','É a resposta explicitamente indicada para desaceleração da turbina.','A exigência de ar da unidade é reduzida para compatibilizar com a máquina.',E(3,3,3,2)),
  O('Aumentar a carga para recuperar energia no regenerador e elevar a rotação.','wrong','Isso aumenta a demanda de ar justamente quando a máquina desacelera.','A margem operacional se deteriora.',E(-3,-3,-3,-1),true),
  O('Manter carga e aumentar agressivamente a injeção de HBF para terminar a lavagem mais cedo.','wrong','HBF reduz temperatura do vapor; aumentar agressivamente não corrige desaceleração e amplia o desvio térmico.','A condição da turbina pode piorar.',E(-3,-3,-3,-1),true)
 ]},
 {prompt:'Que acompanhamento adicional deve ser solicitado?',context:'A máquina está em condição transitória.',options:[
  O('Acompanhamento de vibração e deslocamento axial/radial pela preditiva.','correct','O procedimento pede esse acompanhamento durante a limpeza.','A resposta mecânica é integrada à decisão operacional.',E(3,2,3,3)),
  O('Usar o CI-39001 como referência contínua e coletar uma única amostra de confirmação no fim do ciclo.','partial','A condutividade é relevante, mas não substitui o acompanhamento mecânico durante a anomalia.','Falta informação imediata sobre integridade mecânica.',E(0,-1,-1,0)),
  O('Nenhum acompanhamento: a desaceleração é esperada e deve ser ignorada até o fim do ciclo.','wrong','A desaceleração exige ajuste operacional conforme o procedimento.','A equipe perde a oportunidade de conter a condição.',E(-3,-2,-3,-2),true)
 ]},
 {prompt:'Após estabilizar, o ciclo deve ser retomado automaticamente?',context:'A rotação voltou a uma condição aceitável.',options:[
  O('Não. Avaliar condições da máquina, parâmetros de condutividade e necessidade de novo ciclo com as áreas responsáveis.','correct','O procedimento prevê avaliação pós-ciclo e decisão conjunta sobre repetição.','A continuidade é baseada em condição, não em automatismo.',E(2,2,3,3)),
  O('Programar um segundo ciclo preventivo sempre que a primeira lavagem atingir o patamar térmico final, mesmo que os parâmetros avaliados estejam satisfatórios.','wrong','O número de ciclos depende da avaliação; não há exigência de dois ciclos fixos.','Pode-se prolongar a manobra sem necessidade.',E(-1,-1,-3,0)),
  O('Retomar apenas porque a rotação estabilizou, sem considerar condutividade.','partial','A condição mecânica sozinha não conclui a avaliação de lavagem.','Falta o indicador de limpeza do condensado.',E(0,0,-2,0))
 ]}
]),
S('j3901-04','Retorno do J-3901 à operação nominal','Lavagem de turbinas','Avançado','Reaquecimento + validação','PE.REF.OPE.CCF.047 §5.2.1.5–1.7','O ciclo de lavagem foi encerrado. É hora de retirar HBF e retornar a turbina à condição nominal sem choque térmico.',[
 ['TI-392052A','patamar final','stable'],['HBF','aberta','stable'],['Condutividade','em avaliação','stable'],['Unidade','estável','stable']
],[
 {prompt:'Qual taxa de reaquecimento é permitida para o J-3901 no retorno?',context:'O reaquecimento é obtido reduzindo a injeção de água HBF.',options:[
  O('Até 9 °C/min, acompanhando a curva pelo TI-392052A.','correct','É a taxa indicada para restabelecer a temperatura nominal do J-3901.','O retorno térmico segue a referência do procedimento.',E(2,3,3,1)),
  O('Reaquecer a 1 °C/min até metade da faixa e depois elevar gradualmente até 9 °C/min, usando o mesmo critério do resfriamento.','partial','1 °C/min é a taxa usada na redução da temperatura; o retorno do J-3901 admite até 9 °C/min.','O retorno seria conservador, mas confunde etapas distintas.',E(1,1,-1,0)),
  O('Sem limite de taxa desde que a pressão fique entre 39 e 40 kgf/cm².','wrong','O procedimento define taxa de aquecimento.','Pode ocorrer choque térmico mesmo com pressão adequada.',E(-2,-3,-3,0),true)
 ]},
 {prompt:'Com que frequência o condensado é amostrado durante a lavagem do J-3901?',context:'A informação é usada na avaliação de limpeza.',options:[
  O('A cada 10 minutos após o início da injeção de HBF.','correct','É a frequência definida para as amostras de condensado do J-3901.','A tendência de condutividade possui resolução adequada ao procedimento.',E(1,1,3,2)),
  O('A cada 15 minutos a partir de 300 °C.','partial','Essa regra pertence à lavagem do J-3902.','Há troca de critérios entre as duas turbinas.',E(0,0,-2,0)),
  O('Manter a leitura do CI-39001 e espaçar as amostras de campo para 20 minutos após o início do reaquecimento.','wrong','O procedimento exige amostras periódicas durante a lavagem.','Perde-se a evolução da condutividade ao longo do ciclo.',E(-1,-1,-3,0))
 ]},
 {prompt:'Qual critério fecha a etapa com qualidade?',context:'A temperatura nominal foi restabelecida.',options:[
  O('Monitorar condições do J-3901 e resultados de condutividade, avaliando com MA/ED se há necessidade de novo ciclo.','correct','É a verificação prevista após o primeiro ciclo.','O retorno nominal é validado junto ao resultado da limpeza.',E(2,2,3,3)),
  O('Encerrar assim que HBF chegar a 0%, independentemente da condutividade.','partial','A posição de HBF não confirma a eficácia da lavagem.','A avaliação de limpeza fica pendente.',E(0,0,-2,0)),
  O('Elevar imediatamente a carga ao valor anterior antes de avaliar a turbina.','wrong','A estabilização e avaliação devem preceder novas exigências à máquina.','Aumenta-se a demanda sem validar a condição pós-lavagem.',E(-2,-2,-2,-1))
 ]}
]),
S('j3902-01','Preparação e lavagem do J-3902','Lavagem de turbinas','Especialista','Pressão, rotação e saturação','PE.REF.OPE.CCF.047 §5.2.2.2–2.4','A turbina do J-3902 será lavada. A lógica se parece com a do J-3901, mas há critérios próprios que o CIC não pode confundir.',[
 ['Carga','7.000 m³/d','stable'],['PI-393061A','39,5 kgf/cm²','stable'],['SI-393056A','≈5000 rpm','stable'],['TI-393058A','reduzindo','down']
],[
 {prompt:'Quais referências de pressão e rotação devem ser mantidas durante o alinhamento de vapor?',context:'A válvula 14” está sendo fechada lentamente.',options:[
  O('PI-393061A entre 39 e 40 kgf/cm² e rotação o mais próximo possível de 5000 rpm no SI-393056A.','correct','São as referências explicitadas para a lavagem do J-3902.','A máquina permanece em condição controlada durante a transição.',E(2,3,3,2)),
  O('PI-39062A entre 39 e 40 kgf/cm² e rotação livre, sem referência.','partial','PI-39062A pertence à lavagem do J-3901; para J-3902 o procedimento cita PI-393061A e ~5000 rpm.','Instrumento de outra máquina é usado como referência.',E(0,-2,-2,0)),
  O('Pressão 35 kgf/cm² e rotação acima de 5500 rpm para compensar o HBF.','wrong','Esses valores não são suportados pelo procedimento.','A máquina é deslocada da faixa definida.',E(-2,-3,-3,0))
 ]},
 {prompt:'Como deve ser feita a redução térmica?',context:'HBF está aquecida e pronta para injeção.',options:[
  O('Abrir HBF lenta e gradualmente para reduzir 1 °C/min, mantendo vapor no mínimo 10 °C acima da temperatura de saturação.','correct','É a regra específica do J-3902.','Reduz-se temperatura sem aproximar o vapor da condição de saturação definida como limite.',E(3,3,3,2)),
  O('Reduzir até 200 °C em 1 °C/min, usando o mesmo limite final fixo do J-3901.','partial','No J-3902 a temperatura final é determinada pela estabilização da pressão da primeira roda, não por 200 °C fixos.','O critério final de outra turbina é aplicado indevidamente.',E(0,-2,-2,0)),
  O('Reduzir 9 °C/min e manter exatamente na temperatura de saturação.','wrong','A redução é 1 °C/min e deve manter margem mínima de 10 °C sobre a saturação.','Há risco de condição térmica inadequada para o vapor/turbina.',E(-3,-3,-3,-1),true)
 ]},
 {prompt:'Como definir o patamar final de estabilização?',context:'A temperatura vem caindo e o PI-393062A é acompanhado.',options:[
  O('Usar a temperatura em que não se observa mais variação de pressão na primeira roda; manter essa condição por 1 hora.','correct','Esse é o critério específico do J-3902 no procedimento.','O patamar final é definido pela resposta da turbina, não por um número arbitrário.',E(2,3,3,2)),
  O('Adotar 200 °C como patamar final se a pressão da primeira roda estabilizar, sem verificar a margem mínima de 10 °C acima da saturação.','partial','Esse valor aparece na sequência do J-3901, não como critério final universal do J-3902.','Mistura-se o método entre máquinas.',E(0,-2,-2,0)),
  O('Encerrar ao primeiro sinal de aumento da pressão de primeira roda.','wrong','O critério é ausência de variação no patamar final, com estabilização de 1 hora.','A lavagem pode ser encerrada prematuramente.',E(-1,-2,-3,0))
 ]}
]),
S('j3902-02','Vibração crescente no J-3902','Lavagem de turbinas','Especialista','HBF + mecânica + primeira roda','PE.REF.OPE.CCF.047 §5.2.2.4 Obs.1–2','Durante a redução de temperatura, vibração e deslocamento axial se aproximam dos valores de alarme.',[
 ['Vibração','subindo','up'],['Deslocamento axial','próximo alarme','up'],['PI-393062A','variando','up'],['HBF','em injeção','stable']
],[
 {prompt:'Qual ação é indicada imediatamente?',context:'A condição ainda não atingiu alarme, mas está se aproximando.',options:[
  O('Reduzir a injeção de HBF, aguardar estabilização e só então reiniciar a injeção.','correct','É a resposta especificada para aumento de vibração/deslocamento axial próximo ao alarme.','A agressividade térmica é reduzida até a máquina estabilizar.',E(3,3,3,2)),
  O('Aumentar HBF para atravessar rapidamente a faixa de vibração.','wrong','O procedimento orienta reduzir, não aumentar, HBF.','A perturbação térmica e mecânica pode aumentar.',E(-3,-3,-3,-1),true),
  O('Reduzir HBF somente se vibração ultrapassar o alarme; abaixo do alarme, manter a taxa térmica sem pausa.','wrong','A tendência mecânica exige mudança na injeção.','A máquina continua caminhando para alarme sem mitigação.',E(-3,-2,-3,-1),true)
 ]},
 {prompt:'Qual instrumento de processo deve receber atenção especial junto com vibração?',context:'É preciso correlacionar a resposta da turbina.',options:[
  O('PI-393062A, pressão da primeira roda.','correct','O procedimento manda monitorar a pressão da 1ª roda por esse indicador.','O CIC correlaciona resposta térmica com pressão interna da turbina.',E(2,2,3,1)),
  O('PI-39866A, vácuo do C-3954.','partial','É crítico para outra manobra, mas não é o indicador citado para a primeira roda do J-3902.','A correlação específica da turbina fica ausente.',E(0,-1,-2,0)),
  O('PDIC-39021, diferencial da L-3902.','wrong','Não é parte do critério de lavagem do J-3902.','O foco se desloca para variável sem relação com a decisão.',E(0,-2,-3,0))
 ]},
 {prompt:'Após estabilizar vibração e deslocamento, qual é o próximo passo?',context:'A máquina retornou a uma tendência aceitável.',options:[
  O('Reiniciar a injeção de HBF de forma controlada, mantendo os critérios de taxa e margem sobre saturação.','correct','O procedimento permite reiniciar após estabilização.','A lavagem continua sem abandonar os limites térmicos.',E(2,3,3,2)),
  O('Retomar HBF totalmente aberta para recuperar o tempo perdido.','wrong','A injeção deve continuar lenta/gradual.','A condição mecânica pode reaparecer rapidamente.',E(-2,-3,-3,-1),true),
  O('Encerrar definitivamente a lavagem em qualquer aumento prévio de vibração.','partial','Pode ser necessário reavaliar, mas o padrão prevê aguardar estabilização e reiniciar HBF.','A decisão é mais restritiva que a sequência definida.',E(1,0,-1,1))
 ]}
]),
S('j3902-03','Amostragem e retorno do J-3902','Lavagem de turbinas','Avançado','Condutividade + reaquecimento','PE.REF.OPE.CCF.047 §5.2.2.5–2.7','A lavagem do J-3902 alcançou a faixa de coleta e depois será encerrada.',[
 ['TI-393058A','300 °C','down'],['Amostragem','iniciar','stable'],['Condutividade','tendência a acompanhar','stable'],['HBF','em uso','stable']
],[
 {prompt:'Quando e com que frequência coletar condensado?',context:'A temperatura acabou de atingir 300 °C.',options:[
  O('A cada 15 min a partir de 300 °C no TI-393058A até o início do reaquecimento.','correct','Essa é a regra de amostragem do J-3902.','A tendência de condutividade cobre a parte relevante do ciclo.',E(1,1,3,2)),
  O('A cada 10 min desde o início do HBF.','partial','Essa é a regra do J-3901, não do J-3902.','As duas máquinas são confundidas.',E(0,0,-2,0)),
  O('A cada 30 min somente abaixo de 250 °C.','wrong','Não corresponde à janela definida no procedimento.','A evolução de condutividade fica subamostrada.',E(-1,-1,-3,0))
 ]},
 {prompt:'Qual taxa de reaquecimento deve ser utilizada no retorno do J-3902?',context:'A injeção de HBF será reduzida.',options:[
  O('1 °C/min, acompanhando a curva indicada no procedimento.','correct','O retorno do J-3902 é mais lento que o do J-3901: 1 °C/min.','A diferença entre as turbinas é respeitada.',E(2,3,3,1)),
  O('Até 9 °C/min, igual ao J-3901.','wrong','Até 9 °C/min é a referência do retorno do J-3901.','Aplica-se uma taxa de outra máquina.',E(-2,-3,-3,0),true),
  O('5 °C/min, como compromisso entre os dois procedimentos.','wrong','Não há esse valor no procedimento.','Cria-se um critério não suportado pela fonte.',E(-1,-2,-3,0))
 ]},
 {prompt:'Quando decidir repetir a lavagem?',context:'Primeiro ciclo concluído e máquina em condição normal.',options:[
  O('Após monitorar condição do J-3902 e parâmetros de condutividade, avaliando com MA/ED a necessidade de novo ciclo.','correct','É a decisão pós-ciclo prevista.','A repetição depende de evidência operacional e de limpeza.',E(2,2,3,3)),
  O('Repetir sempre, independentemente dos resultados.','wrong','O procedimento condiciona a repetição à avaliação.','A unidade fica exposta a uma manobra adicional sem justificativa.',E(-1,-1,-3,0)),
  O('Nunca repetir se a rotação voltou a 5000 rpm.','partial','Rotação normal não responde sozinha pela eficácia da limpeza.','A condutividade e a avaliação conjunta são ignoradas.',E(0,0,-2,0))
 ]}
]),
S('pdt39018','Desobstrução do PDT-39018C da L-3901','Instrumentação/slide-valves','Avançado','Override + intertravamento','Checklist PE.REF.OPE.CCF.044-D','O PDT-39018C precisa ser desobstruído. O campo executará a limpeza; o CIC deve proteger a estratégia de controle durante o bypass.',[
 ['PDIC-39017','AUTO','stable'],['LIC-39001','condição atual','stable'],['PDSX-39018C','habilitado','stable'],['ΔP L-3901','a monitorar','stable']
],[
 {prompt:'Como preparar as malhas antes do bypass do instrumento?',context:'A limpeza de tomadas vai retirar temporariamente a confiabilidade do PDT.',options:[
  O('PDIC-39017 em MANUAL com MV=100% e LIC-39001 em AUTO.','correct','É a preparação listada no checklist do PDT-39018C.','O nível do D-3903 assume sua estratégia enquanto o diferencial fica em condição controlada.',E(2,3,3,2)),
  O('PDIC-39017 em AUTO e LIC-39001 em MANUAL, mantendo a MV atual.','wrong','Inverte os modos definidos no checklist.','O controle pode reagir a um sinal indisponível durante a limpeza.',E(-2,-3,-3,0),true),
  O('Colocar ambos em MANUAL e congelar as saídas.','partial','O checklist mantém LIC-39001 em AUTO.','Perde-se a estratégia automática de nível prevista para a manobra.',E(0,-2,-2,0))
 ]},
 {prompt:'Durante o bypass PDSX-39018C, como o CIC deve acompanhar a segurança do ΔP?',context:'Uma das tomadas está sendo aberta/limpa no campo.',options:[
  O('Monitorar continuamente o diferencial pelos PDIs disponíveis e/ou pela diferença entre as pressões locais informadas.','correct','O checklist reforça monitoramento constante do diferencial durante o bypass.','A perda temporária de uma medição não significa operar sem referência de ΔP.',E(3,3,3,3)),
  O('Suspender o acompanhamento de ΔP até o instrumento retornar, pois o intertravamento está bypassado.','wrong','O bypass aumenta, não reduz, a necessidade de monitoramento.','Uma condição real de ΔP pode evoluir sem proteção automática.',E(-3,-3,-3,-2),true),
  O('Acompanhar somente a posição da L-3901 no SDCD.','partial','Posição não substitui a confirmação do diferencial de pressão.','A variável protegida pelo intertravamento não é observada diretamente.',E(0,-2,-2,0))
 ]},
 {prompt:'Quando normalizar o intertravamento?',context:'O campo informa que a tomada foi limpa.',options:[
  O('Após confirmar coerência do PDI-39018C com PI-39082/PI-39083, valor em faixa segura e valor de trip confirmado.','correct','O checklist exige coerência e condição segura antes de habilitar novamente o intertravamento.','A proteção retorna somente com medição validada.',E(3,3,3,3)),
  O('Normalizar após o PI local voltar a indicar pressão, mesmo que a coerência com o PDI ainda não tenha sido confirmada.','wrong','A normalização depende da validação da medição.','O intertravamento pode voltar com sinal ainda incoerente.',E(-3,-2,-3,-1),true),
  O('Retornar primeiro o PDIC-39017 ao modo anterior e, em seguida, comparar PDI/PI para liberar a normalização do intertravamento.','wrong','A validação do instrumento precede a normalização da proteção.','A malha pode receber sinal não confiável.',E(-2,-3,-3,-1),true)
 ]}
]),
S('pdt39022','Desobstrução dos PDTs da L-3902','Instrumentação/slide-valves','Especialista','Seleção de PDSX + redundância','PE.REF.OPE.CCF.045','Um dos PDTs da L-3902 apresenta restrição. O CIC precisa executar a preparação correta e não confundir os pares de pressão dos canais A/B/C.',[
 ['PDIC-39021','AUTO','stable'],['TIC-39001X','controle riser','stable'],['Canal','a identificar','stable'],['ΔP L-3902','crítico','stable']
],[
 {prompt:'Qual preparação de malhas é prevista antes da desobstrução?',context:'A limpeza será feita em um dos canais A/B/C.',options:[
  O('PDIC-39021 em MANUAL, MV=100%, e TIC-39001X em AUTO.','correct','É a preparação repetida para os canais do PDT-39022.','A temperatura do riser fica sob controle automático enquanto o ΔP selecionado é tratado.',E(2,3,3,2)),
  O('PDIC-39021 em AUTO e TIC-39001X em MANUAL com saída fixa.','wrong','Inverte os modos definidos no padrão.','O controlador diferencial pode reagir ao canal em manutenção.',E(-2,-3,-3,0),true),
  O('PDIC-39021 MANUAL com MV na posição atual e TIC-39001X AUTO.','partial','O procedimento especifica MV=100%.','A preparação fica incompleta.',E(0,-1,-2,0))
 ]},
 {prompt:'O canal B será limpo. Qual chave de bypass e qual par de PI corresponde à validação?',context:'Evite confundir os três canais disponíveis.',options:[
  O('PDSX-39022B; comparar PDI-39022B com PI-39974 e PI-39975.','correct','É o conjunto associado ao canal B no procedimento.','O canal correto é contornado e validado pela referência correspondente.',E(2,2,3,2)),
  O('PDSX-39022A; PI-39979 e PI-39980.','wrong','Esse conjunto pertence ao canal A.','O canal errado pode ser bypassado/validado.',E(-2,-2,-3,-1),true),
  O('PDSX-39022C; PI-39097 e PI-39098.','wrong','Esse conjunto pertence ao canal C.','A proteção seria alterada no canal incorreto.',E(-2,-2,-3,-1),true)
 ]},
 {prompt:'Qual é o critério para voltar a habilitar o canal B?',context:'A limpeza terminou e o campo realinhou o instrumento.',options:[
  O('Indicação local coerente com PDI-39022B, valor em faixa segura de controle e valor de trip confirmado antes de habilitar PDSX.','correct','O padrão repete esse aviso para cada canal.','O intertravamento retorna com sinal validado e limite conhecido.',E(3,3,3,3)),
  O('PDI retornar a uma indicação estável por alguns instantes, mesmo antes de comparar com o par de PIs locais correspondente.','partial','Sair de BAD não prova coerência nem faixa segura.','A normalização pode ocorrer com erro de medição.',E(0,-1,-2,0)),
  O('Normalizar assim que a limpeza física acabar e depois comparar as indicações.','wrong','A comparação e validação devem preceder a normalização.','A proteção pode atuar ou deixar de atuar com sinal incorreto.',E(-3,-2,-3,-1),true)
 ]}
]),
S('pdt-cross','Falha de referência durante desobstrução','Instrumentação/slide-valves','Especialista','Diagnóstico com proteção bypassada','PE.REF.OPE.CCF.045 + Checklist 044-D','Durante uma desobstrução, o canal tratado ainda não apresenta coerência depois da primeira tentativa de limpeza.',[
 ['Intertravamento','bypassado','up'],['PDI','incoerente','up'],['PIs de referência','disponíveis','stable'],['Processo','estável','stable']
],[
 {prompt:'O que fazer com o instrumento ainda incoerente?',context:'O campo relata que a primeira limpeza foi concluída.',options:[
  O('Não normalizar o intertravamento; manter monitoramento por referências válidas e repetir/reavaliar a limpeza até obter coerência.','correct','Os procedimentos condicionam realinhamento/normalização à confirmação de coerência.','A proteção não é rearmada sobre uma medição duvidosa.',E(3,3,3,3)),
  O('Normalizar o intertravamento para testar se ele reconhece o instrumento.','wrong','O intertravamento não deve ser usado como teste de uma medição incoerente.','Pode ocorrer atuação indevida ou falsa sensação de proteção.',E(-3,-3,-3,-1),true),
  O('Colocar todos os demais canais também em bypass para uniformizar a lógica.','wrong','Isso remove redundância/proteção adicional sem necessidade.','O conversor fica mais exposto durante a manutenção.',E(-3,-3,-3,-1),true)
 ]},
 {prompt:'A tendência real de ΔP começa a se aproximar da faixa crítica enquanto a proteção está bypassada. Qual prioridade?',context:'O problema agora é de processo, não apenas de instrumento.',options:[
  O('Tratar a condição de processo imediatamente e interromper a progressão da manutenção, usando as medições confiáveis para decisão.','correct','Bypass de proteção exige vigilância e não autoriza operar além de condição segura.','A estabilidade da slide-valve volta a ser a prioridade.',E(3,3,2,3)),
  O('Concluir a limpeza antes de agir, pois o PDT tratado precisa voltar primeiro.','wrong','A condição real do processo tem prioridade sobre a conclusão da manutenção.','O ΔP pode evoluir sem proteção automática.',E(-3,-3,-2,-1),true),
  O('Ignorar a tendência se a posição da slide-valve não mudou.','wrong','Posição não substitui a variável de ΔP.','Uma condição crítica pode se desenvolver sem alteração aparente da posição.',E(-3,-3,-2,0),true)
 ]},
 {prompt:'O que o operador deve registrar mentalmente como “fim real” da manobra?',context:'A indicação finalmente ficou coerente.',options:[
  O('Medição validada + intertravamento normalizado + modos de controle retornados à configuração operacional prevista + processo estável.','correct','A manobra não termina apenas com a limpeza física; inclui normalização de proteção e controle.','O sistema volta integralmente à filosofia de operação.',E(3,3,3,3)),
  O('Confirmação do campo de limpeza concluída somada à indicação estável do PDI, sem comparação obrigatória com os PIs locais.','partial','É necessário, mas não suficiente para validar instrumentação e lógica.','A parte de controle/proteção pode permanecer incompleta.',E(0,-1,-2,0)),
  O('Habilitar a PDSX e retirar a chave do TRICONEX assim que o PDI estiver na faixa, deixando a conferência final dos modos das malhas para depois.','wrong','Normalização exige mais que a chave física.','A unidade pode ficar em configuração transitória sem ser percebido.',E(-1,-2,-3,-1))
 ]}
]),
S('remosa-01','Colocação do sistema Remosa em automático','Válvulas Remosa','Avançado','Prevenção de movimento não comandado','PE.REF.OPE.CCF.068 §5.2.1.1–1.5','Uma válvula especial será colocada em operação pelo sistema hidráulico Remosa. O CIC acompanha o risco de movimento inesperado e a condição final do sistema.',[
 ['Sistema de óleo','alinhado','stable'],['HCV hidráulica','a posicionar','stable'],['Sinal SDCD','presente','stable'],['Válvula','parada','stable']
],[
 {prompt:'Antes de partir o sistema de óleo, qual posição é importante na HCV hidráulica?',context:'Existe sinal de comando proveniente do SDCD.',options:[
  O('MANUAL hidráulica, para impedir que a válvula se mova de acordo com o sinal do SDCD no momento da partida do óleo.','correct','A nota do procedimento explica exatamente essa finalidade.','A pressurização do sistema não provoca movimento inesperado da válvula.',E(3,3,3,2)),
  O('MANUAL/AUTO, permitindo que o sistema hidráulico acompanhe o sinal do SDCD durante a partida e seja equalizado depois.','wrong','Isso é justamente o movimento que a etapa MANUAL hidráulica pretende evitar.','Pode ocorrer deslocamento abrupto ao pressurizar o atuador.',E(-3,-3,-3,-1),true),
  O('NORMAL, pois essa posição bloqueia o sinal do SDCD durante a partida.','partial','O procedimento usa MANUAL hidráulica nessa etapa.','A sequência definida não é respeitada.',E(0,-2,-2,0))
 ]},
 {prompt:'Depois do alinhamento hidráulico, o que caracteriza retorno ao controle normal?',context:'As HCVs locais estão sendo sequenciadas pelo campo.',options:[
  O('HCVs posicionadas conforme sequência AUTO / MANUAL-AUTO / NORMAL e estado final confirmado, com coerência entre campo e sinal de controle.','correct','O procedimento usa essas posições em sequência para operação automática.','A válvula passa ao regime normal sem salto intencional.',E(2,3,3,3)),
  O('Basta selecionar a bomba principal; as posições das HCVs não alteram o comando da válvula.','wrong','As HCVs definem o modo de atuação do sistema.','A válvula pode não responder como esperado.',E(-2,-2,-3,-1)),
  O('Deixar MANUAL hidráulica e comandar a válvula exclusivamente do SDCD.','wrong','Com a HCV em manual hidráulica, a filosofia automática não está restabelecida.','O CIC presume um controle que não está efetivamente ativo.',E(-2,-3,-3,-1))
 ]},
 {prompt:'Qual alerta especial existe para L-3903 e PDV-39027C?',context:'O painel indica comando de TRIP/ESD do sistema.',options:[
  O('Elas não possuem comando de TRIP (ESD) que as feche automaticamente quando acionado.','correct','O procedimento traz esse aviso explicitamente.','O operador não presume um fechamento automático inexistente.',E(3,2,3,2)),
  O('Elas fecham automaticamente e não precisam de verificação de posição após ESD.','wrong','É o oposto do aviso do procedimento.','A equipe pode acreditar que existe isolamento quando a válvula permaneceu aberta.',E(-3,-3,-3,-2),true),
  O('Somente a L-3903 possui ESD; a PDV-39027C não.','partial','O aviso inclui L-3903 e PDV-39027C.','A filosofia de segurança de uma das válvulas é interpretada incorretamente.',E(-1,-1,-2,0))
 ]}
]),
S('remosa-02','Atuação manual hidráulica Remosa','Válvulas Remosa','Avançado','Sensibilidade do comando + coordenação','PE.REF.OPE.CCF.068 §5.2.1.10–1.13','É necessária atuação manual hidráulica de uma válvula especial durante operação normal.',[
 ['Modo','manual hidráulico','stable'],['HCV de comando','sensível','up'],['Processo','estável','stable'],['Campo-CIC','em contato','stable']
],[
 {prompt:'Como deve ser aplicado o comando de abrir/fechar?',context:'A HCV de atuação é descrita como muito sensível.',options:[
  O('De forma suave, com acompanhamento da resposta da válvula e da variável de processo.','correct','O procedimento alerta que o comando deve ser suave devido à sensibilidade da HCV.','A mudança de posição não produz solavanco desnecessário.',E(2,3,3,3)),
  O('Em pulsos largos para superar atrito e depois corrigir a posição.','wrong','A orientação é comando suave, não agressivo.','A posição pode ultrapassar o necessário e perturbar o processo.',E(-2,-3,-3,-1)),
  O('Abrir totalmente e retornar até a posição desejada, para confirmar curso.','wrong','Essa ação não é prevista e amplia o distúrbio.','A variável associada à válvula pode sofrer grande deslocamento.',E(-2,-3,-3,-1),true)
 ]},
 {prompt:'Qual é o papel do CIC enquanto o campo atua localmente?',context:'O comando físico é do campo, mas o efeito aparece no processo.',options:[
  O('Acompanhar tendência da variável controlada/posição indicada, coordenar incrementos com o campo e parar a progressão se houver perturbação relevante.','correct','É uma aplicação direta da necessidade de operação suave e coordenação campo-painel.','O movimento local é guiado pela resposta global do processo.',E(3,3,2,3)),
  O('Monitorar somente a posição indicada no SDCD durante a atuação manual, deixando a confirmação da resposta do processo para o fim do movimento.','wrong','A resposta do processo deve ser acompanhada durante a atuação sensível.','Um distúrbio pode evoluir antes da comunicação final.',E(-1,-3,-1,-2)),
  O('Compensar simultaneamente a variável por outras malhas antes de observar o efeito da HCV.','partial','Compensações podem ser necessárias, mas agir simultaneamente sem observar a resposta reduz diagnóstico e pode causar interação.','Fica difícil distinguir a causa de cada alteração.',E(0,-1,0,1))
 ]},
 {prompt:'Após atingir a posição desejada, qual conferência é mais robusta?',context:'A tendência voltou a estabilizar.',options:[
  O('Confirmar posição/mode local, indicação no SDCD e estabilidade da variável de processo antes de encerrar a coordenação.','correct','Evita assumir que comando local e supervisão remota estão coerentes.','A condição final é validada por três referências.',E(2,3,2,3)),
  O('Confirmar a posição local e a indicação do SDCD, mas dispensar a estabilização da variável de processo antes do próximo comando.','partial','A indicação remota é útil, mas a manobra local pede confirmação de estado e processo.','Pode persistir discrepância local/remota.',E(0,-1,-1,0)),
  O('Encerrar quando o campo disser “pronto”, sem conferir o processo.','wrong','A resposta de processo é parte essencial da validação operacional.','A perturbação residual pode não ser percebida.',E(-1,-2,-2,-1))
 ]}
]),
S('remosa-03','Retorno do volante para automático','Válvulas Remosa','Especialista','Bumpless transfer mecânico/SDCD','PE.REF.OPE.CCF.068 §5.2.1.15–1.16','Uma válvula foi movimentada pelo volante do atuador. Agora ela precisa voltar ao controle hidráulico/automático.',[
 ['Volante','acoplado','up'],['Posição válvula','local','stable'],['Sinal SDCD','diferente','up'],['Processo','estável','stable']
],[
 {prompt:'Qual ação é proibida enquanto o volante está acoplado?',context:'O atuador ainda está mecanicamente engatado.',options:[
  O('Acionar a HCV de comando da válvula.','correct','O procedimento alerta que acionar a HCV com o volante acoplado pode danificar o atuador.','Evita esforço incompatível entre comando hidráulico e acoplamento mecânico.',E(3,2,3,2)),
  O('Monitorar a posição pelo SDCD.','wrong','Monitorar não é a ação proibida; o risco é comandar a HCV com volante acoplado.','A resposta não identifica o perigo real.',E(-1,0,-2,0)),
  O('Comunicar o CIC antes de desacoplar.','wrong','Comunicação é desejável; não é a proibição citada.','O risco mecânico permanece sem reconhecimento.',E(-1,0,-2,0))
 ]},
 {prompt:'Depois de desacoplar o volante, como evitar solavanco ao voltar ao automático?',context:'A posição física da válvula e o sinal do SDCD estão diferentes.',options:[
  O('Equalizar o valor de posição da válvula com o sinal do SDCD antes da transferência para automático.','correct','O aviso do procedimento relaciona essa equalização à prevenção de solavanco e perturbação de processo.','A transferência ocorre sem degrau de posição.',E(3,3,3,3)),
  O('Passar diretamente para automático; o controlador corrigirá a diferença.','wrong','É exatamente o salto que a equalização pretende evitar.','A válvula pode se mover bruscamente para o sinal remoto.',E(-3,-3,-3,-1),true),
  O('Levar o sinal do SDCD para uma posição conservadora predefinida e então passar para automático, em vez de igualá-lo à posição real da válvula.','wrong','O objetivo é equalizar sinal e posição, não zerar arbitrariamente.','Pode ocorrer deslocamento igualmente brusco.',E(-2,-3,-3,-1),true)
 ]},
 {prompt:'Qual validação encerra a manobra?',context:'O sinal foi equalizado e o campo posicionou as HCVs para retorno.',options:[
  O('Confirmar desacoplamento, posição HCV/servo correta, coerência SDCD-campo e resposta estável do processo.','correct','Integra as verificações necessárias para retorno controlado.','O sistema volta ao automático com estado conhecido.',E(3,3,3,3)),
  O('Confirmar AUTO no SDCD e coerência de posição, mas avançar antes de verificar se a variável de processo estabilizou.','partial','AUTO na tela não garante desacoplamento mecânico ou coerência de posição.','Pode persistir condição local incompatível.',E(0,-1,-2,0)),
  O('Solicitar nova movimentação pelo volante para testar se o automático realmente assumiu.','wrong','Com o sistema devolvido ao automático, o volante não deve ser usado como teste de controle.','Cria nova intervenção mecânica desnecessária.',E(-1,-2,-2,-1))
 ]}
]),
S('sample-cold','Amostragem na área fria: interface CIC-campo','Amostragem','Intermediário','Consciência situacional','PE.REF.OPE.CCF.065 §5.2.1','A coleta é uma atividade de campo. Neste cenário, o foco do CIC é entender os riscos e confirmar uma comunicação coerente quando a amostragem ocorre durante operação normal.',[
 ['Atividade','amostragem área fria','stable'],['Execução','TO Campo','stable'],['Processo','normal','stable'],['Comunicação','CIC-campo','stable']
],[
 {prompt:'Uma amostra leve precisa ser representativa. Qual prática do procedimento ajuda a evitar contaminação por amostra anterior?',context:'O campo prepara recipiente/dispositivo de amostragem.',options:[
  O('Limpar o dispositivo e, para produtos leves, rinçar o recipiente com o próprio produto a ser amostrado.','correct','O padrão referencia essa prática para preservar representatividade.','A amostra enviada ao laboratório representa melhor a corrente atual.',E(2,1,3,2)),
  O('Usar o mesmo recipiente da amostra anterior sem rinsagem, desde que o produto seja da mesma área.','wrong','Resíduo de amostra anterior pode alterar o caráter representativo.','O resultado pode ser contaminado por material residual.',E(-1,-1,-3,0)),
  O('Rinçar apenas com água industrial antes da coleta.','wrong','Para produtos leves o procedimento cita rinsagem com o próprio produto.','Pode haver água residual e alteração da amostra.',E(-1,-1,-3,0))
 ]},
 {prompt:'Na coleta em cilindro, qual cuidado de segurança é explicitamente indicado?',context:'Existe risco de vazamento de gás pelas conexões.',options:[
  O('Uso de máscara COMBITOX e atenção ao risco de vazamento nas conexões do cilindro.','correct','O procedimento traz advertência de máscara e aviso de vazamento.','O CIC compreende o risco quando coordena/acompanha a atividade de campo.',E(3,0,3,2)),
  O('Máscara contra pó, pois o principal risco é particulado.','wrong','Máscara contra pó aparece na amostragem de catalisador da área quente, não aqui.','O risco de gás é tratado com EPI inadequado.',E(-3,0,-3,0),true),
  O('Sem proteção respiratória se a amostra for pequena.','wrong','O procedimento explicita proteção respiratória para a coleta em cilindro.','O risco de exposição é subestimado.',E(-3,0,-3,0),true)
 ]},
 {prompt:'Como o CIC deve interpretar este tipo de atividade no treinamento?',context:'A execução física não ocorre no painel.',options:[
  O('Como consciência operacional e coordenação: reconhecer riscos, manter comunicação e evitar atribuir ao CIC ações de coleta que são de campo.','correct','Mantém o treinamento fiel à divisão de responsabilidades do procedimento.','O operador de painel entende a interface sem “inventar” manobras no SDCD.',E(2,1,3,3)),
  O('Como manobra de SDCD: abrir remotamente as válvulas do amostrador para acelerar a coleta.','wrong','O procedimento não atribui esse comando remoto ao CIC.','Cria-se uma ação inexistente na fonte.',E(-2,-1,-3,-1)),
  O('Ignorar totalmente a atividade, pois não altera nenhuma responsabilidade da operação.','partial','Mesmo sendo de campo, riscos e comunicação fazem parte da consciência operacional do turno.','Perde-se integração entre painel e campo.',E(0,0,-1,-1))
 ]}
]),
S('sample-hot','Amostragem na área quente: riscos que o CIC deve reconhecer','Amostragem','Intermediário','Risco térmico/químico + comunicação','PE.REF.OPE.CCF.066 §5.2.1','O TO Campo executa amostragem na área quente enquanto a unidade permanece normal. O CIC deve reconhecer riscos e saber o que esperar da comunicação.',[
 ['Atividade','amostragem quente','stable'],['Execução','TO Campo','stable'],['Risco','térmico/químico','up'],['Unidade','normal','stable']
],[
 {prompt:'Em amostragem de líquido quente em lata, qual risco operacional merece destaque?',context:'O produto precisa ser coletado sem expor o trabalhador ao calor.',options:[
  O('Queimadura/contato térmico, exigindo sequência de condicionamento/resfriamento e proteção adequada das mãos.','correct','O procedimento dedica sequência e controles ao risco térmico da amostragem quente.','O CIC entende que a atividade pode exigir tempo e coordenação, não pressa.',E(3,0,3,2)),
  O('Somente risco de poeira, tratado com máscara contra pó.','wrong','Poeira é associada à amostragem de catalisador, não ao líquido quente.','O principal risco térmico é ignorado.',E(-3,0,-3,0)),
  O('Nenhum risco especial, pois a lata dissipa calor instantaneamente.','wrong','A amostragem quente possui controles específicos.','A tarefa seria tratada de forma insegura.',E(-3,0,-3,0),true)
 ]},
 {prompt:'Na amostragem de catalisador, qual proteção respiratória é indicada?',context:'A coleta pode gerar particulado.',options:[
  O('Máscara contra pó, devido ao risco de aspiração de particulado.','correct','É o controle indicado no quadro de itens críticos da amostragem quente.','O risco respiratório é reconhecido de forma específica.',E(3,0,3,1)),
  O('Máscara COMBITOX obrigatoriamente, pelo risco principal de gás de cilindro.','partial','COMBITOX aparece na amostragem em cilindro da área fria; para catalisador o padrão indica máscara contra pó.','O EPI é confundido entre tipos de amostra.',E(0,0,-2,0)),
  O('Nenhuma máscara se o catalisador estiver visualmente seco.','wrong','Secura não elimina o risco de aspiração de pó.','O risco particulado é subestimado.',E(-3,0,-3,0),true)
 ]},
 {prompt:'Uma amostra em balão pode envolver gases tóxicos. Qual proteção aparece no procedimento da área quente?',context:'O campo reporta preparação para a coleta gasosa.',options:[
  O('Máscara para CO/CO₂ conforme o risco indicado para amostragem em balão.','correct','O quadro de itens críticos associa a amostragem em balão a gases tóxicos e essa proteção.','O CIC reconhece a criticidade da tarefa quando recebe a comunicação do campo.',E(3,0,3,2)),
  O('Somente luvas longas; não há risco respiratório nessa coleta.','wrong','O procedimento explicita risco de gases e proteção respiratória.','A exposição respiratória seria ignorada.',E(-3,0,-3,0),true),
  O('Máscara contra pó, por ser o EPI padrão de todas as amostragens quentes.','wrong','Os EPIs variam conforme o tipo de amostra/risco.','A proteção é escolhida por generalização incorreta.',E(-2,0,-3,0))
 ]}
]),
S('press-05','Normalização da PDV-39027C após transferência','Pressão do regenerador','Avançado','Fechamento completo da manobra','PE.REF.OPE.CCF.063 §5.2.2.8','A pressão do D-3904 já foi transferida da PDV-39027C para as L-3903 A1/A2. O CIC precisa garantir que a retirada da PDV seja concluída sem deixar uma configuração transitória esquecida.',[
 ['Controle de pressão','L-3903 A1/A2','stable'],['PDV-39027C','fechada','stable'],['Bombas de óleo','a retirar','stable'],['Acumuladores','a bloquear','stable']
],[
 {prompt:'Depois de confirmar que as L-3903 assumiram a pressão, qual condição deve ser mantida para a PDV-39027C?',context:'A PDV já foi totalmente fechada durante a transferência.',options:[
  O('Retirar a PDV-39027C de operação, mantendo-a fechada enquanto o controle permanece nas L-3903.','correct','O procedimento encerra a transferência retirando a PDV-39027C de operação.','Evita deixar um caminho de controle não utilizado parcialmente disponível.',E(2,3,3,2)),
  O('Reabrir a PDV a 10% para mantê-la aquecida e disponível para uma futura transferência.','wrong','O procedimento determina a retirada da PDV de operação após a transferência.','Cria-se um caminho adicional não previsto na condição final.',E(-1,-2,-3,0)),
  O('Deixar a posição da PDV a critério do controlador PIC-39027, mesmo após sua retirada da função de controle.','partial','A condição final prevista é a PDV fechada e retirada de operação.','A normalização fica incompleta.',E(0,-1,-2,0))
 ]},
 {prompt:'Qual sequência de campo o CIC deve confirmar para completar a retirada da PDV?',context:'A válvula não é mais necessária para controlar a pressão.',options:[
  O('Parar as bombas de óleo da PDV-39027C e bloquear os acumuladores reserva de óleo.','correct','Essas ações constam na etapa final de retirada da PDV.','O sistema hidráulico da válvula fica coerente com a condição fora de operação.',E(2,2,3,3)),
  O('Parar as bombas de óleo, mas manter os acumuladores reserva alinhados até o fim do turno para facilitar eventual retorno da PDV.','wrong','A válvula está sendo retirada de operação; o procedimento manda parar bombas e bloquear acumuladores reserva.','A condição física não corresponde ao estado operacional declarado.',E(-1,-1,-3,-1)),
  O('Parar as bombas de óleo, mantendo os acumuladores reserva pressurizados e alinhados até a confirmação final da manobra.','partial','Não corresponde à retirada completa prescrita.','Permanece energia hidráulica disponível sem necessidade.',E(0,0,-2,0))
 ]},
 {prompt:'Qual confirmação fecha a coordenação CIC-campo?',context:'Bombas e acumuladores já foram tratados.',options:[
  O('Confirmar a válvula em manual local, operação por volante engatada e travada fechada, além de pressão do regenerador estável nas L-3903.','correct','É a condição física final indicada no procedimento, combinada com a validação de processo pelo CIC.','A manobra termina com controle, posição e estado físico coerentes.',E(3,3,3,3)),
  O('Confirmar PIC-39027 fora de controle e PDV fechada no SDCD, deixando a checagem do modo local/volante para o campo encerrar sem novo retorno ao CIC.','partial','O estado da malha não substitui a confirmação física da PDV retirada de operação.','Pode permanecer divergência entre painel e campo.',E(0,-1,-2,-1)),
  O('Considerar encerrada após estabilidade da pressão e confirmação de bombas paradas, mesmo sem receber a confirmação do volante travado na posição fechada.','wrong','A retirada inclui ações físicas específicas na PDV.','Uma configuração transitória pode permanecer esquecida.',E(-1,-1,-3,-2))
 ]}
]),
S('c3954-05','Retrolavagem específica do Passo II','C-3954','Especialista','Sequência Passo II + retorno hidráulico','PE.REF.OPE.CCF.064 §5.2.1.6–1.7','O Passo II foi identificado como o mais sujo. O CIC precisa reconhecer a sequência própria de isolamento, lavagem e retorno, sem confundir as MCVs dos dois passos.',[
 ['Passo I','100% disponível','stable'],['Passo II','a isolar','down'],['PI-39866','estável','stable'],['FQI-39802','sob vigilância','stable']
],[
 {prompt:'Como preparar o Passo I antes de reduzir o Passo II?',context:'O Passo I ficará sustentando a troca durante a retirada do Passo II.',options:[
  O('Manter MCV-39048 ou MCV-39050 e MCV-39814 100% abertas em local/manual.','correct','É a preparação do passo remanescente antes da retrolavagem do Passo II.','A capacidade disponível do Passo I é preservada antes de retirar o Passo II.',E(2,3,3,2)),
  O('Reduzir simultaneamente os dois passos a 20% para equilibrar a vazão.','wrong','O procedimento mantém o Passo I aberto enquanto reduz o Passo II.','A capacidade total de condensação cai de forma desnecessária.',E(-3,-3,-3,-1),true),
  O('Manter apenas MCV-39814 aberta e fechar as entradas do Passo I.','wrong','Entrada e saída do passo em serviço devem permanecer disponíveis.','O Passo I não sustentaria adequadamente o serviço.',E(-2,-3,-3,0))
 ]},
 {prompt:'Quais válvulas identificam a retrolavagem do Passo II?',context:'O CIC liberou o fechamento total das MCVs normais do Passo II após avaliar o vácuo.',options:[
  O('MCV-39818 na entrada da retrolavagem e MCV-39820 no retorno, abertas simultaneamente a 100% por 20 minutos.','correct','Esse é o par específico do Passo II e o tempo de lavagem indicado.','O passo é lavado no alinhamento correto e pelo período previsto.',E(2,2,3,2)),
  O('MCV-39817 e MCV-39819 por 20 minutos.','wrong','Esse par corresponde ao Passo I.','O operador confunde os alinhamentos dos dois passos.',E(-2,-2,-3,-1),true),
  O('MCV-39049 e MCV-39816, mantendo-as a 20% durante a lavagem.','partial','Essas são válvulas do caminho normal de água do Passo II; a retrolavagem usa 39818/39820.','A configuração de lavagem não é estabelecida corretamente.',E(0,-2,-3,0))
 ]},
 {prompt:'Depois de lavar o Passo II, qual validação antecede o encerramento?',context:'As MCVs normais estão sendo reabertas lenta e gradualmente.',options:[
  O('Confirmar PI-39833 entre 0,6 e 1,7 kgf/cm², FQI-39802 em torno de 160.000 m³/d, vácuo estável e devolver as MCVs previstas ao remoto/SDCD.','correct','O procedimento valida pressão, vazão e normalização do modo das válvulas após a lavagem.','O CIC confirma desempenho antes de considerar o sistema normalizado.',E(3,3,3,3)),
  O('Encerrar assim que MCV-39818 e 39820 forem fechadas, sem conferir pressão ou vazão.','wrong','A normalização inclui o retorno hidráulico e a confirmação das variáveis.','Pode permanecer restrição ou alinhamento incorreto.',E(-2,-3,-3,-1)),
  O('Manter as válvulas em local/manual mesmo após a vazão normalizar.','partial','O procedimento devolve as MCVs indicadas ao modo remoto após a manobra.','O sistema fica fora da condição normal de controle.',E(0,-1,-2,0))
 ]}
]),
S('j3901-05','Patamares completos da lavagem do J-3901','Lavagem de turbinas','Especialista','Disciplina de patamares + avaliação conjunta','PE.REF.OPE.CCF.047 §5.2.1.4','O J-3901 chegou a 250 °C durante a redução a 1 °C/min. A partir daqui, o procedimento não autoriza simplesmente seguir até 200 °C: cada avanço depende de avaliação conjunta.',[
 ['TI-392052A','250 °C','down'],['HBF','modulando','stable'],['Pressão vapor','39–40 kgf/cm²','stable'],['Avaliação técnica','necessária','up']
],[
 {prompt:'Qual sequência de patamares está prevista após 250 °C, caso cada avaliação autorize continuar?',context:'A redução continua sempre a 1 °C/min entre os patamares.',options:[
  O('240 → 235 → 230 → 225 → 220 → 215 → 210 → 205 → 200 °C.','correct','Essa é a sequência de patamares registrada no procedimento do J-3901.','O operador distingue uma sequência condicionada de uma rampa contínua até 200 °C.',E(2,3,3,2)),
  O('245 → 240 → 230 → 220 → 210 → 200 °C.','partial','A sequência reduzida não corresponde aos patamares definidos no documento.','Etapas intermediárias de avaliação seriam eliminadas.',E(0,-2,-3,0)),
  O('250 → 200 °C em rampa contínua, desde que a taxa permaneça em 1 °C/min.','wrong','O documento prevê avaliações sucessivas antes de avançar aos patamares inferiores.','A taxa correta não compensa a eliminação dos pontos de decisão.',E(-2,-3,-3,-1),true)
 ]},
 {prompt:'O que autoriza sair de um patamar e seguir para o próximo?',context:'Deslocamento axial, pressão de primeiro estágio, condutividade e governadora estão sendo acompanhados.',options:[
  O('Avaliação conjunta EST/OT, MA/ED e OP/CCF de que os parâmetros estão coerentes com a evolução da limpeza.','correct','O documento condiciona a continuidade à avaliação conjunta desses parâmetros.','A decisão térmica é baseada na resposta real da turbina e do condensado.',E(3,3,3,3)),
  O('Somente a temperatura ficar estável por cinco minutos.','wrong','O procedimento não usa esse critério isolado.','Pode-se avançar apesar de sinais mecânicos desfavoráveis.',E(-2,-2,-3,-1)),
  O('A condutividade diminuir uma única vez em relação à amostra anterior.','partial','Condutividade é um dos critérios, mas a avaliação é conjunta com parâmetros mecânicos e operacionais.','A decisão fica baseada em evidência insuficiente.',E(0,-1,-2,0))
 ]},
 {prompt:'Ao atingir o último patamar acordado, quanto tempo ele deve ser mantido?',context:'O último patamar pode ser 200 °C ou outro patamar definido pela avaliação conjunta.',options:[
  O('Uma hora, seguida de nova avaliação do MA/ED antes de prosseguir.','correct','O procedimento determina permanência de 1 hora no último patamar acordado.','A lavagem ganha tempo de estabilização e avaliação antes do retorno.',E(2,2,3,2)),
  O('Dez minutos, coincidindo com o intervalo de coleta do condensado.','wrong','O intervalo de amostragem não define o tempo do patamar final.','A estabilização seria encerrada antes do previsto.',E(-1,-2,-3,0)),
  O('Até a condutividade zerar, sem limite de tempo.','wrong','O procedimento estabelece avaliação de parâmetros e permanência de uma hora, não condutividade zero.','Cria-se um critério não existente na fonte.',E(-1,-2,-3,0))
 ]}
]),
S('pdt39022-ac','Identificação dos canais A e C da L-3902','Instrumentação/slide-valves','Especialista','Pareamento PDSX/PIs + normalização','PE.REF.OPE.CCF.045 §PDT-39022A/B/C','A lógica operacional é semelhante nos três canais, mas a segurança depende de contornar e validar exatamente o canal que está em manutenção.',[
 ['Canal A','disponível','stable'],['Canal B','disponível','stable'],['Canal C','disponível','stable'],['Risco','troca de identificação','up']
],[
 {prompt:'Qual conjunto corresponde ao canal A?',context:'A tomada do PDT-39022A será desobstruída.',options:[
  O('PDSX-39022A com referência local PI-39979 e PI-39980.','correct','É o conjunto especificado para o PDT-39022A.','O canal correto é bypassado e posteriormente comparado com seus PIs correspondentes.',E(2,2,3,2)),
  O('PDSX-39022A com PI-39974 e PI-39975.','wrong','PI-39974/39975 pertencem ao canal B.','A validação seria feita com instrumentos de outro canal.',E(-2,-2,-3,-1),true),
  O('PDSX-39022A com PI-39097 e PI-39098.','wrong','PI-39097/39098 pertencem ao canal C.','A referência local fica incorreta.',E(-2,-2,-3,-1),true)
 ]},
 {prompt:'Qual conjunto corresponde ao canal C?',context:'Agora a intervenção será no PDT-39022C.',options:[
  O('PDSX-39022C com PI-39097 e PI-39098.','correct','É o conjunto definido para o PDT-39022C.','A equipe mantém rastreabilidade correta entre canal, chave e pressões locais.',E(2,2,3,2)),
  O('PDSX-39022C com PI-39979 e PI-39980.','wrong','Esse par pertence ao canal A.','Pode-se aceitar uma falsa coerência usando referências erradas.',E(-2,-2,-3,-1),true),
  O('PDSX-39022B com PI-39097 e PI-39098.','wrong','A chave também deve corresponder ao canal C.','O bypass seria aplicado ao canal incorreto.',E(-3,-2,-3,-1),true)
 ]},
 {prompt:'O que é comum à normalização dos canais A, B e C?',context:'A limpeza física terminou e o instrumento voltou a indicar.',options:[
  O('Comparar PDI com o par de PIs correspondente, confirmar faixa segura e valor de trip antes de habilitar a PDSX e normalizar o TRICONEX.','correct','O mesmo critério de segurança é repetido para os três canais.','A proteção volta somente após validação independente da medição.',E(3,3,3,3)),
  O('Normalizar quando o PDI apresentar valor estável e dentro da faixa esperada, mesmo antes de comparar com os dois PIs locais correspondentes.','wrong','Indicação presente não significa indicação coerente ou segura.','A proteção pode voltar baseada em uma medição errada.',E(-3,-2,-3,-1),true),
  O('Comparar PDI e PIs e, estando coerentes, normalizar usando o último valor de trip conhecido, sem reconfirmá-lo antes da operação.','wrong','O documento pede confirmação do valor de trip antes da normalização.','Um limite incorreto pode ser assumido em uma etapa crítica.',E(-2,-2,-3,-1))
 ]}
]),
S('remosa-04','Bombas principal e reserva do sistema Remosa','Válvulas Remosa','Avançado','Disponibilidade hidráulica + confirmação local','PE.REF.OPE.CCF.068 §5.2.1.6–1.7','O sistema hidráulico está sendo colocado em serviço. O painel local permite selecionar a bomba principal e definir a condição da reserva. O CIC precisa saber o que deve ser confirmado pelo campo.',[
 ['Sistema de óleo','alinhado','stable'],['Bomba principal','a selecionar','stable'],['Bomba reserva','a configurar','stable'],['Indicação HS','disponível','stable']
],[
 {prompt:'Como o campo seleciona qual bomba fica como principal no painel local?',context:'A tela de manutenção/comando manual foi acessada pela tecla F4.',options:[
  O('S11 seleciona a bomba A como principal e S12 seleciona a bomba B como principal; a HS correspondente evidencia a principal em verde.','correct','Essa é a lógica descrita no procedimento.','O CIC recebe confirmação inequívoca de qual bomba está designada como principal.',E(1,2,3,3)),
  O('S13 escolhe a bomba A e S14 escolhe a bomba B.','wrong','S13/S14 são usados para modo automático/manual da bomba reserva.','A função das teclas é confundida.',E(-1,-1,-3,-1)),
  O('Selecionar a bomba principal pelo painel local, mas considerar suficiente apenas a indicação de partida, sem conferir a HS que evidencia qual bomba ficou principal.','wrong','O documento descreve a seleção no painel local.','A equipe procuraria um comando que não corresponde ao procedimento.',E(-1,-1,-3,-2))
 ]},
 {prompt:'Qual lógica de partida/parada é indicada para a bomba principal?',context:'A bomba principal já foi selecionada.',options:[
  O('S3 parte e S4 para a bomba A; S5 parte e S6 para a bomba B.','correct','O procedimento associa essas teclas às duas bombas principais possíveis.','A coordenação CIC-campo usa a sequência correta de comandos locais.',E(1,1,3,2)),
  O('S7/S8 partem e param a principal A; S15/S16 fazem o mesmo para a B.','wrong','S7/S8 e S15/S16 pertencem à bomba do resfriador de óleo e seu modo.','Os comandos de sistemas diferentes seriam misturados.',E(-1,-1,-3,-1)),
  O('S3 parte qualquer bomba selecionada e S4 alterna automaticamente para a reserva.','partial','O documento diferencia comandos de A e B; S4 é parada da A.','A lógica local seria interpretada de modo simplificado demais.',E(0,0,-2,0))
 ]},
 {prompt:'Como deve ser tratada a bomba reserva para preservar disponibilidade?',context:'A principal está operando normalmente.',options:[
  O('Colocar a reserva em AUTO por S13; se a principal falhar, a reserva deve assumir entrando em operação.','correct','O documento descreve S13 para AUTO e a entrada da reserva em caso de falha da principal.','O sistema mantém redundância hidráulica disponível.',E(2,3,3,3)),
  O('Manter a reserva em MANUAL durante a estabilização inicial e somente depois transferi-la para AUTO, mesmo sem condição anormal na principal.','wrong','O modo automático é justamente a condição que permite assumir na falha da principal.','A redundância automática é perdida.',E(-2,-2,-3,-1)),
  O('Parar a reserva e bloquear sua alimentação durante operação normal.','wrong','Não é a filosofia descrita para a bomba reserva.','Uma falha da principal perde a alternativa imediata.',E(-2,-3,-3,-1))
 ]}
]),
S('remosa-05','Refrigeração do óleo e condição completa do Remosa','Válvulas Remosa','Avançado','Temperatura do óleo + modos locais','PE.REF.OPE.CCF.068 §5.2.1.7–1.9','Com a bomba principal e a reserva configuradas, falta assegurar que o sistema de refrigeração do óleo e os alinhamentos hidráulicos também estejam na condição prevista.',[
 ['Filtragem','alinhada','stable'],['Refrigeração','a automatizar','stable'],['Acumuladores','alinhados','stable'],['Drenos','fechados','stable']
],[
 {prompt:'Qual condição do sistema de óleo deve ser confirmada antes de qualquer atuação manual ou por volante?',context:'A válvula especial pode exigir movimentação local.',options:[
  O('Filtragem e refrigeração alinhadas, acumuladores alinhados e drenos fechados.','correct','Essa verificação aparece antes das formas de operação do atuador.','A movimentação parte de um sistema hidráulico integralmente condicionado.',E(2,2,3,3)),
  O('Confirmar filtragem e nível de óleo, deixando acumuladores e drenos para checagem após a primeira atuação da válvula.','partial','O nível pode ser relevante, mas o procedimento destaca todo o alinhamento do sistema.','A confirmação fica incompleta.',E(0,-1,-2,0)),
  O('Drenos parcialmente abertos para garantir circulação e retirada de ar.','wrong','A condição indicada é drenos fechados.','O sistema pode perder pressão/óleo durante a atuação.',E(-2,-2,-3,0))
 ]},
 {prompt:'Como colocar a bomba do resfriador de óleo em automático?',context:'O painel local está disponível.',options:[
  O('Usar S15; a bomba passa a circular óleo pelo resfriador conforme a temperatura de set point, com AUTO evidenciado na HS.','correct','Essa é a lógica de operação automática descrita.','A refrigeração responde à necessidade térmica do óleo sem comando contínuo do operador.',E(1,2,3,2)),
  O('Usar S13, a mesma tecla do modo automático da bomba reserva principal.','wrong','S13 refere-se à bomba reserva; o resfriador usa S15.','Dois subsistemas distintos são confundidos.',E(-1,-1,-3,-1)),
  O('Usar S7 para selecionar automático e S8 para selecionar manual.','wrong','S7/S8 são comandos de partida/parada quando a bomba do resfriador está em manual.','Modo e comando são misturados.',E(-1,-1,-3,0))
 ]},
 {prompt:'Se a bomba do resfriador precisar operar manualmente, qual sequência é coerente?',context:'A necessidade foi definida pelo campo/supervisão.',options:[
  O('S16 coloca em MANUAL; S7 coloca a bomba em operação e S8 retira a bomba de operação.','correct','O procedimento separa seleção de modo e comando de partida/parada.','O CIC consegue confirmar com o campo exatamente qual estado foi aplicado.',E(1,1,3,3)),
  O('S16 parte a bomba diretamente e S15 a para.','wrong','S15/S16 selecionam AUTO/MANUAL, não partida/parada.','A sequência local seria executada incorretamente.',E(-1,-1,-3,-1)),
  O('Em MANUAL a bomba permanece sempre ligada, sem comando de parada disponível.','wrong','O documento prevê S7 para partir e S8 para parar.','A lógica operacional é interpretada de forma incorreta.',E(-1,-1,-3,0))
 ]}
]),
S('sample-cold-02','Recipiente correto e representatividade na área fria','Amostragem','Avançado','Conhecimento CIC sobre preparação de campo','PE.REF.OPE.CCF.065 §5.1–5.2.1.5','Embora a coleta seja executada pelo TO Campo, o operador CIC deve reconhecer quando uma preparação relatada é incompatível com o tipo de produto e pode comprometer segurança ou representatividade.',[
 ['Área','fria','stable'],['Coleta','programada','stable'],['Execução','TO Campo','stable'],['CIC','coordena/acompanha','stable']
],[
 {prompt:'Qual associação de recipiente/produto está de acordo com o procedimento?',context:'O campo informa o tipo de amostra antes de sair para a coleta.',options:[
  O('Garrafa de vidro: gasolina, soda, dissulfeto líquido, DEA e água; cilindro: GLP/propano/propeno; balão: gás ácido/gás combustível.','correct','Essas associações aparecem nas definições do padrão da área fria.','O CIC reconhece rapidamente uma preparação incompatível antes da atividade.',E(2,1,3,3)),
  O('Garrafa plástica para gasolina e nafta; cilindro para soda; balão para GLP.','wrong','O documento restringe frasco plástico para produtos adequados e define cilindro/balão para outras correntes.','A coleta pode perder representatividade ou segurança.',E(-2,-1,-3,-1),true),
  O('Qualquer recipiente pode ser usado se estiver limpo e seco.','wrong','A seleção depende do produto e das análises a realizar.','Compatibilidade do recipiente é ignorada.',E(-2,-1,-3,0))
 ]},
 {prompt:'Qual regra de enchimento preserva espaço para expansão e homogeneização?',context:'O campo prepara uma amostra líquida.',options:[
  O('Não ultrapassar 80% da capacidade do recipiente.','correct','O padrão estabelece espaço adicional para expansão térmica e homogeneização.','A amostra mantém margem física adequada no recipiente.',E(2,0,3,1)),
  O('Encher 100% para eliminar qualquer fase vapor.','wrong','O documento orienta nunca encher completamente o recipiente.','A expansão térmica pode gerar condição inadequada.',E(-2,0,-3,0)),
  O('Usar no máximo 50% independentemente do produto.','partial','O procedimento indica limite de 80%, não uma regra geral de 50%.','A regra é lembrada de forma incorreta.',E(0,0,-2,0))
 ]},
 {prompt:'Na amostragem de gasolina/nafta com presença de benzeno, qual confirmação de campo é essencial?',context:'A coleta será em garrafa.',options:[
  O('Identificação com adesivo “Presença de Benzeno” e uso das proteções previstas para hidrocarbonetos/vapores orgânicos.','correct','O procedimento exige a identificação e lista proteção para o risco de benzeno/hidrocarbonetos.','A comunicação CIC-campo reconhece a criticidade específica da corrente.',E(3,0,3,3)),
  O('Somente usar garrafa âmbar; não é necessária identificação adicional.','wrong','A identificação de presença de benzeno é explicitamente exigida.','O risco químico fica mal comunicado no manuseio posterior.',E(-3,0,-3,-1),true),
  O('Aplicar etiqueta de benzeno apenas se o laboratório solicitar depois da coleta.','wrong','A identificação faz parte da preparação/coleta segura.','A amostra circula sem identificação do risco.',E(-3,0,-3,-1))
 ]}
]),
S('sample-cold-03','Cilindro e balão: coordenação CIC-campo','Amostragem','Avançado','Flare + gases + sequência de isolamento','PE.REF.OPE.CCF.065 §5.2.1.6–1.15','O campo realizará amostragens gasosas na área fria. O CIC não executa as conexões, mas deve compreender a sequência para reconhecer desvios e manter boa coordenação.',[
 ['Amostra 1','cilindro','stable'],['Amostra 2','balão','stable'],['Risco','inalação/vazamento','up'],['Comunicação','ativa','stable']
],[
 {prompt:'Na preparação da amostragem em cilindro, o que ocorre com a linha de circulação para o flare?',context:'O cilindro e as válvulas já foram verificados pelo campo.',options:[
  O('A circulação para o flare é aberta para limpeza; depois o cilindro é conectado e a sequência de circulação pelo cilindro é feita antes do isolamento e remoção.','correct','O procedimento usa a linha para o flare durante limpeza e normalização da coleta em cilindro.','O CIC reconhece que o flare faz parte do alinhamento seguro da atividade.',E(3,1,3,3)),
  O('A linha para o flare deve permanecer bloqueada durante toda a atividade.','wrong','O padrão usa explicitamente a circulação para o flare.','A sequência de limpeza/isolamento seria descaracterizada.',E(-2,-1,-3,-1)),
  O('O cilindro é conectado somente após encher a linha com líquido do processo.','wrong','A amostragem descrita é gasosa e usa circulação de gás.','O tipo de coleta é interpretado incorretamente.',E(-2,-1,-3,0))
 ]},
 {prompt:'Qual proteção respiratória é explicitamente associada à coleta em cilindro?',context:'Há risco de vazamento nas conexões do cilindro/rabicho.',options:[
  O('Máscara COMBITOX.','correct','É a advertência específica da amostragem em cilindro na área fria.','O risco de inalação é tratado com a proteção indicada.',E(3,0,3,2)),
  O('Máscara contra pó.','wrong','Máscara contra pó aparece na coleta de catalisador da área quente.','O EPI é escolhido por analogia errada.',E(-3,0,-3,0)),
  O('Sem proteção respiratória se a linha estiver inicialmente alinhada ao flare.','wrong','A advertência permanece para a coleta em cilindro.','O risco de vazamento é subestimado.',E(-3,0,-3,0),true)
 ]},
 {prompt:'Na amostragem em balão, qual sequência simples o CIC deve reconhecer como coerente?',context:'O objetivo é evitar líquido acumulado no trecho e exposição desnecessária.',options:[
  O('Eliminar o líquido acumulado pelo amostrador, fechar, conectar a mangueira do balão, encher com cuidado, fechar válvula e presilha e identificar a amostra.','correct','Essa é a sequência descrita para o balão na área fria.','O operador de painel consegue identificar uma comunicação de campo coerente com o procedimento.',E(2,0,3,3)),
  O('Conectar o balão antes de eliminar qualquer líquido para evitar perda de gás.','wrong','O procedimento manda primeiro eliminar o líquido acumulado no trecho.','O balão pode receber material inadequado à amostra gasosa.',E(-2,0,-3,-1)),
  O('Deixar a válvula do amostrador aberta após encher o balão para equalizar pressão.','wrong','A válvula e a presilha devem ser fechadas.','A amostra e o sistema ficam indevidamente abertos.',E(-3,0,-3,-1))
 ]}
]),
S('sample-hot-02','Garrafa e líquido em lata na área quente','Amostragem','Avançado','Benzeno + condicionamento térmico','PE.REF.OPE.CCF.066 §5.2.1.1–1.2','O TO Campo fará duas coletas na área quente. O CIC deve reconhecer os pontos críticos da preparação e não pressionar a execução física além da sequência segura.',[
 ['Coleta 1','garrafa de vidro','stable'],['Coleta 2','líquido em lata','up'],['Risco','benzeno/calor','up'],['CIC','acompanha','stable']
],[
 {prompt:'Para produto com presença de benzeno em garrafa de vidro, o que deve ser confirmado?',context:'A amostra será identificada e encaminhada após a coleta.',options:[
  O('Máscara para hidrocarbonetos e adesivo “presença de benzeno” no recipiente, além de recipiente em boas condições e trecho previamente limpo.','correct','Esses cuidados estão explícitos na amostragem em garrafa da área quente.','A coleta combina representatividade e comunicação do risco químico.',E(3,0,3,3)),
  O('Apenas luva de cano longo, porque o risco predominante de toda a área quente é térmico.','wrong','O documento diferencia os riscos conforme o tipo de amostra; benzeno exige proteção/identificação específica.','O risco respiratório/químico fica mal tratado.',E(-3,0,-3,-1),true),
  O('Adesivo de benzeno somente se a amostra for coletada em lata.','wrong','A exigência aparece explicitamente para produto com benzeno em garrafa.','A amostra pode seguir sem identificação correta.',E(-3,0,-3,-1))
 ]},
 {prompt:'Antes de coletar líquido quente em lata, como o amostrador é condicionado?',context:'Existe resfriador dedicado ao amostrador.',options:[
  O('Abrir água de refrigeração e verificar vazão para esgoto; fechar vapor, alinhar produto e eliminar condensado/flushing-oil antes de coletar.','correct','Essa sequência consta na etapa de amostragem de líquido em lata.','O campo reduz o risco térmico e melhora a representatividade da amostra.',E(3,1,3,3)),
  O('Fechar água de refrigeração para evitar choque térmico e coletar imediatamente após abrir produto.','wrong','O procedimento manda abrir a refrigeração antes da coleta.','A exposição a produto quente aumenta.',E(-3,-1,-3,-1),true),
  O('Manter vapor e produto simultaneamente abertos durante toda a coleta para evitar solidificação.','wrong','O documento prevê fechamento do vapor durante a passagem de produto.','O alinhamento fica diferente do procedimento.',E(-3,-1,-3,-1))
 ]},
 {prompt:'Depois de retirar a amostra de líquido em lata, qual normalização faz parte da sequência?',context:'A coleta terminou dentro da capela.',options:[
  O('Fechar o produto, realinhar vapor para limpar o amostrador até sair condensado, drenar conforme sequência e depois fechar a água de refrigeração.','correct','O padrão inclui limpeza pós-coleta com vapor e encerramento da refrigeração.','O amostrador volta a uma condição preparada para o serviço seguinte.',E(2,1,3,2)),
  O('Fechar tudo imediatamente e deixar o produto residual no trecho para a próxima amostra.','wrong','O procedimento prevê limpeza após a coleta.','Resíduo pode comprometer segurança e próxima amostragem.',E(-2,-1,-3,0)),
  O('Manter água e vapor continuamente alinhados até a próxima rodada de amostras.','partial','Não corresponde ao encerramento descrito; a água é fechada após a sequência de limpeza.','O sistema fica em condição diferente da prevista.',E(0,0,-2,0))
 ]}
]),
S('sample-hot-03','Catalisador e balão na área quente','Amostragem','Especialista','Sangria + particulado + gases tóxicos','PE.REF.OPE.CCF.066 §5.2.1.3–1.4','A área quente realizará amostra de catalisador e, depois, amostra gasosa em balão. O CIC precisa distinguir os riscos e entender a lógica de condicionamento comunicada pelo campo.',[
 ['Amostra','catalisador','up'],['Linha','a condicionar','stable'],['Amostra gasosa','posterior','stable'],['Risco','pó/gases','up']
],[
 {prompt:'Na amostragem de catalisador, qual lógica de condicionamento aparece antes de encher a lata?',context:'O campo está trabalhando na válvula plug do costado do regenerador.',options:[
  O('Usar as sangrias de ar, abrir o orifício de restrição, soprar o trecho para a capela e drenar catalisador até aquecer a linha antes da coleta.','correct','Essa sequência está descrita para limpar/condicionar o amostrador de catalisador.','O CIC entende por que a atividade requer etapas antes da retirada da amostra.',E(3,1,3,3)),
  O('Abrir diretamente a válvula para o amostrador e encher a lata com a primeira descarga.','wrong','O procedimento condiciona o trecho antes da coleta representativa.','A coleta ignora purga/condicionamento e aumenta o risco operacional.',E(-3,-1,-3,-1),true),
  O('Usar água de refrigeração no amostrador de catalisador até reduzir a temperatura da linha.','wrong','Essa sequência pertence à amostragem de líquido em lata, não ao catalisador.','Procedimentos de amostras diferentes são confundidos.',E(-2,-1,-3,0))
 ]},
 {prompt:'Qual proteção está associada ao risco crítico da amostra de catalisador?',context:'A atividade pode liberar particulado fino.',options:[
  O('Máscara contra pó, devido ao risco de aspiração de catalisador.','correct','O quadro de itens críticos associa diretamente esse EPI ao catalisador.','O risco particulado é tratado de forma específica.',E(3,0,3,2)),
  O('Máscara para CO/CO₂, pois todo material do regenerador é gasoso.','wrong','CO/CO₂ é o controle indicado para amostragem em balão; catalisador exige máscara contra pó.','O risco principal da coleta sólida é confundido.',E(-3,0,-3,0)),
  O('Somente luvas de cano longo.','partial','Luvas longas aparecem no risco de líquido quente; não substituem proteção respiratória contra pó.','A aspiração de particulado permanece sem controle adequado.',E(-1,0,-2,0))
 ]},
 {prompt:'Na amostragem em balão da área quente, qual risco/proteção o CIC deve reconhecer?',context:'A linha gasosa será purgada antes de conectar/encher o balão.',options:[
  O('Risco de gases tóxicos, com máscara para CO/CO₂; eliminar líquido acumulado no trecho antes de conectar e encher o balão.','correct','O procedimento combina a sequência de limpeza do trecho com o controle respiratório indicado no quadro crítico.','A coordenação reconhece tanto a representatividade quanto a exposição gasosa.',E(3,0,3,3)),
  O('Risco principal de poeira, com máscara contra pó e sem necessidade de drenar líquido.','wrong','Isso confunde a amostra gasosa com a de catalisador.','O risco e a preparação são tratados incorretamente.',E(-3,0,-3,-1),true),
  O('Nenhuma proteção respiratória se o balão for preenchido rapidamente.','wrong','O quadro crítico explicita proteção respiratória para gases tóxicos.','A velocidade da coleta não elimina o risco de exposição.',E(-3,0,-3,-1),true)
 ]}
]),
S('c3954-06','Checklist de válvulas e ajuste final do C-3954','C-3954','Avançado','Condição mecânica + 2 m/s','PE.REF.OPE.CCF.064 §5.2.1.4 e §5.2.1.7','Antes de retirar um passo de serviço e novamente no fechamento da manobra, existem verificações que evitam iniciar ou encerrar a retrolavagem com válvulas/condições hidráulicas desconhecidas.',[
 ['MCVs','a verificar','stable'],['Indicação mecânica','campo','stable'],['Velocidade tubos','a ajustar','stable'],['Inspeção','orientação aplicável','stable']
],[
 {prompt:'Antes de iniciar a retirada de um passo, que confirmação deve vir do campo?',context:'As MCVs serão levadas a local/manual durante a retrolavagem.',options:[
  O('Checar visor e indicação mecânica de cada MCV contra a condição normal e testar previamente a atuação das válvulas envolvidas.','correct','O procedimento pede a checagem mecânica e teste de atuação antes da manobra.','O CIC inicia a sequência sabendo que as válvulas necessárias estão operacionais e coerentes.',E(2,2,3,3)),
  O('Comparar as posições pelo SDCD e testar o comando remoto das MCVs, dispensando a conferência da indicação mecânica local antes da manobra.','wrong','O padrão solicita explicitamente a checagem mecânica de cada MCV.','Uma divergência local/remota pode aparecer somente durante a etapa crítica.',E(-2,-2,-3,-1)),
  O('Testar as MCVs do passo a lavar e confirmar visualmente as do passo em serviço, sem testar previamente a atuação destas últimas.','partial','O procedimento lista e manda checar o conjunto de MCVs do C-3954 antes da sequência.','A capacidade do passo remanescente pode não estar comprovada.',E(0,-1,-2,0))
 ]},
 {prompt:'Depois das retrolavagens e da normalização hidráulica, qual ajuste completa o procedimento?',context:'Pressão, vazão e vácuo estão normais.',options:[
  O('Ajustar a velocidade da água nos tubos para 2 m/s, reduzindo as aberturas de entrada/saída conforme orientação da Inspeção de Equipamentos.','correct','Essa é a etapa final operacional descrita no procedimento.','O sistema volta à condição de velocidade prevista, limitando risco de erosão.',E(2,3,3,2)),
  O('Restabelecer as MCVs a 100% e usar somente a vazão FQI-39802 como critério, sem realizar o ajuste específico de 2 m/s orientado pela Inspeção.','wrong','O item crítico associa velocidade excessiva à erosão e fixa 2 m/s.','A normalização introduziria risco de erosão nos tubos.',E(-2,-3,-3,0),true),
  O('Manter a posição que resultou em 160.000 m³/d, mesmo que a velocidade nos tubos esteja diferente de 2 m/s.','partial','A vazão total é uma verificação importante, mas o procedimento inclui também o ajuste específico de velocidade.','A condição hidráulica final fica incompleta.',E(0,-1,-2,0))
 ]}
]),
S('pdt-clean-flow','Sequência física de limpeza das tomadas: visão CIC','Instrumentação/slide-valves','Avançado','Handshake CIC-campo durante limpeza','PE.REF.OPE.CCF.045 + Checklist PE.REF.OPE.CCF.044-D','O campo executa a limpeza física das tomadas de alta e baixa pressão. O CIC não realiza drenos/mangueiras, mas precisa saber quais marcos devem ser confirmados antes de avançar e antes de devolver o instrumento à lógica.',[
 ['Intertravamento','bypassado','up'],['Campo','limpeza em execução','stable'],['Referências válidas','mantidas','stable'],['CIC','monitorando ΔP','stable']
],[
 {prompt:'Qual descrição representa corretamente a lógica da limpeza física de uma tomada?',context:'A tomada e o PI correspondente foram bloqueados para iniciar o serviço.',options:[
  O('Drenar/soprar o trecho com ar, conectar a mangueira de alta pressão, usar água até sair limpa pelo ponto previsto e depois restabelecer ar para deixar a árvore condicionada.','correct','Os procedimentos da L-3901 e L-3902 repetem essa lógica para tomadas de alta e baixa pressão.','O CIC reconhece os marcos da intervenção sem assumir comandos que pertencem ao campo.',E(2,1,3,3)),
  O('Aplicar água diretamente com o instrumento alinhado para verificar se a pressão muda.','wrong','O instrumento é bloqueado e a árvore é condicionada por uma sequência específica antes do realinhamento.','Pode-se expor instrumento/linha a uma condição inadequada.',E(-2,-1,-3,-1)),
  O('Soprar apenas com ar até a indicação do PDI retornar, sem uso de água.','wrong','A sequência descrita inclui água de alta pressão até saída limpa.','A limpeza fica diferente da prevista nos procedimentos.',E(-1,-1,-3,0))
 ]},
 {prompt:'Quando o campo pode realinhar o PI/PDT após a limpeza?',context:'A água limpa já foi observada e a árvore voltou a passar somente ar.',options:[
  O('Após sentir/confirmar fluxo pela linha e então verificar se a pressão realinhada está coerente com o sistema.','correct','Os procedimentos usam a coerência da pressão como confirmação de desobstrução.','O CIC recebe uma confirmação funcional, não apenas a informação de que a limpeza terminou.',E(2,2,3,3)),
  O('Após reconectar/realinhar o PI e observar indicação estável, mesmo antes de comparar a pressão com a condição real do sistema.','wrong','A desobstrução deve ser confirmada pela pressão coerente após o realinhamento.','Uma restrição residual pode ser aceita como concluída.',E(-2,-2,-3,-1)),
  O('Depois de habilitar a PDSX, mas antes de retirar a chave do TRICONEX, usando a resposta do intertravamento como confirmação da medição.','wrong','A validação do instrumento vem antes da normalização da proteção.','A lógica seria rearmada antes de comprovar a medição.',E(-3,-2,-3,-1),true)
 ]},
 {prompt:'Se a pressão continuar incoerente após a primeira tentativa, qual é a decisão correta?',context:'A proteção continua bypassada e outras referências ainda estão disponíveis.',options:[
  O('Não normalizar; retornar/repetir o procedimento de limpeza até obter êxito, mantendo o ΔP monitorado pelas referências válidas.','correct','Os documentos orientam retornar o procedimento quando a desobstrução não é confirmada.','A proteção não é rearmada sobre um instrumento ainda duvidoso.',E(3,3,3,3)),
  O('Normalizar o intertravamento e usar a atuação da lógica para testar se o valor é aceitável.','wrong','A lógica só deve ser normalizada após coerência e faixa segura confirmadas.','O intertravamento vira um teste indevido de uma medição não validada.',E(-3,-3,-3,-1),true),
  O('Abandonar o acompanhamento de ΔP até nova tentativa de manutenção.','wrong','Com a proteção bypassada, o monitoramento por referências válidas é ainda mais importante.','A condição real do processo pode evoluir sem proteção automática.',E(-3,-3,-3,-2),true)
 ]}
])
];


const COVERAGE = [
  ['PE.REF.OPE.CCF.065','Amostragem de Produtos da Área Fria','9/9 páginas','recipientes, representatividade, garrafa, cilindro, balão e interface CIC-campo'],
  ['PE.REF.OPE.CCF.066','Amostragem de Produtos da Área Quente','9/9 páginas','garrafa, líquido em lata, catalisador, balão e riscos específicos'],
  ['PE.REF.OPE.CCF.045','Desobstrução de PDTs da Slide-Valve L-3902','12/12 páginas','PDT-39022 A/B/C, bypass, referências locais e normalização'],
  ['PE.REF.OPE.CCF.044-D','Checklist PDT-39018C – L-3901','4/4 páginas','preparação de malhas, bypass, limpeza e normalização'],
  ['PE.REF.OPE.CCF.047','Lavagem das Turbinas J-3901/J-3902','11/11 páginas','preparação, HBF, patamares, mecânica, condutividade e retorno'],
  ['PE.REF.OPE.CCF.068','Operação das Válvulas Remosa','11/11 páginas','automático, bombas, resfriador, manual hidráulico e volante'],
  ['PE.REF.OPE.CCF.064','Retrolavagem do C-3954','9/9 páginas','pré-condições, Passos I/II, vácuo, hidráulica e normalização'],
  ['PE.REF.OPE.CCF.063','Transferência do Controle de Pressão do D-3904','8/8 páginas','transferência nos dois sentidos e retirada final da PDV-39027C']
];

let deferredPrompt = null;
let state = loadState();
let current = null;

function defaultState(){ return { mode:'training', completed:{}, answers:0, correct:0, partial:0, wrong:0 }; }
function loadState(){
  try {
    const own=localStorage.getItem(STORAGE_KEY);
    if(own) return {...defaultState(), ...JSON.parse(own)};
    for(const key of LEGACY_STORAGE_KEYS){
      const old=localStorage.getItem(key);
      if(old){ const migrated={...defaultState(), ...JSON.parse(old)}; localStorage.setItem(STORAGE_KEY,JSON.stringify(migrated)); return migrated; }
    }
  } catch(e){}
  return defaultState();
}
function saveState(){ localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); }
function esc(s=''){return String(s).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
function scoreClass(q){return q==='correct'?'correct':q==='partial'?'partial':'wrong'}
function qualityLabel(q){return q==='correct'?'Decisão recomendada':q==='partial'?'Decisão parcialmente adequada':'Decisão inadequada'}
function progressStats(){
  const rows=Object.values(state.completed||{}); const done=rows.length; const mastered=rows.filter(r=>r.mastered).length;
  return {done,mastered,total:SCENARIOS.length,pct:Math.round(done/SCENARIOS.length*100),masteryPct:Math.round(mastered/SCENARIOS.length*100)};
}
function totalDecisions(){return SCENARIOS.reduce((n,s)=>n+s.steps.length,0)}
function avgScore(){ const vals=Object.values(state.completed||{}).map(x=>x.score); return vals.length?Math.round(vals.reduce((a,b)=>a+b,0)/vals.length):0; }
function qualityPoints(q){return q==='correct'?100:q==='partial'?55:0}
function statusFor(r){ if(!r)return 'notstarted'; return r.mastered?'mastered':'review'; }
function shuffledIndices(n){ const a=Array.from({length:n},(_,i)=>i); for(let i=n-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
function masteryRule(score,critical,qScore){return score>=82 && critical===0 && qScore>=75;}
function weakestDimension(scores){return Object.keys(scores).sort((a,b)=>scores[a]-scores[b])[0];}
function coachingFor(dim){return ({
  safety:'Reforce os gates de segurança e as condições que impedem avanço da manobra.',
  stability:'Reforce leitura de tendência, preservação de margem e estabilização antes da próxima ação.',
  procedure:'Reforce sequência, modos de controle, tracking e critérios objetivos de normalização.',
  coordination:'Reforce o handshake CIC-campo: solicitar, confirmar, observar a resposta e só então liberar a etapa seguinte.'
})[dim]||'';}

function topbar(){ return `<div class="topbar"><div class="brand"><img src="icons/icon-192.png" alt=""><div><h1>${APP_NAME}</h1><small>U-39 · Training Scenario Engine · foco operador CIC · ${APP_VERSION}</small></div></div><div class="actions"><button id="installBtn" class="btn primary">Instalar App</button><button id="updateBtn" class="btn ghost">Atualizar app</button></div></div>`; }
function footer(){return `<div class="footer-note">Treinamento complementar baseado nos padrões fornecidos. Para execução real, prevalecem o procedimento vigente, a condição da unidade e as autorizações operacionais aplicáveis.</div>`}

function home(){
 current=null; const p=progressStats();
 const cats=['Todos',...new Set(SCENARIOS.map(s=>s.category))];
 document.querySelector('#app').innerHTML=`<main class="app">${topbar()}
 <section class="hero"><div class="eyebrow">Treinamento de operação normal · painel de controle</div><h2>Decidir pelo processo, não por memorização de passos.</h2><p>A V3 mantém a cobertura integral da V2 e refina a experiência do operador de CIC: alternativas embaralhadas, avaliação cega, consequência encadeada, critério de domínio e revisão comparando sua decisão com a ação recomendada pelo procedimento.</p>
 <div class="kpis"><div class="kpi"><b>${SCENARIOS.length}</b><span>cenários técnicos</span></div><div class="kpi"><b>${totalDecisions()}</b><span>decisões operacionais</span></div><div class="kpi"><b>${p.mastered}/${p.total}</b><span>cenários dominados</span></div><div class="kpi"><b>${avgScore()}%</b><span>média de desempenho</span></div></div>
 <div class="progress" style="margin-top:12px"><i style="width:${p.masteryPct}%"></i></div></section>
 <section class="refinement"><div class="eyebrow">Refinamento V3 · sem inflar conteúdo</div><div class="refine-grid"><div><b>Alternativas menos previsíveis</b><small>Ordem A/B/C muda a cada tentativa; distratores críticos foram aproximados da lógica real, alterando um modo, referência, tempo ou sequência.</small></div><div><b>Avaliação cega</b><small>Sem feedback e sem pontuação por dimensão durante o cenário. A fonte também fica oculta até o resultado.</small></div><div><b>Consequência encadeada</b><small>A resposta da decisão anterior acompanha a etapa seguinte, forçando o operador a considerar o estado que ele próprio criou.</small></div><div><b>Domínio operacional</b><small>Não basta nota alta: decisão crítica inadequada impede o cenário de ser marcado como dominado.</small></div></div></section>
 <section class="coverage"><div class="coverage-head"><div><div class="eyebrow">Auditoria de cobertura V3</div><h3>8 documentos · 73 páginas inspecionadas · cobertura preservada</h3></div><span class="badge">refinamento pedagógico sem adicionar fatos externos</span></div><div class="coverage-grid">${COVERAGE.map(r=>`<div class="coverage-item"><b>${esc(r[0])}</b><span>${esc(r[1])}</span><small>${esc(r[2])} · ${esc(r[3])}</small></div>`).join('')}</div></section>
 <div class="toolbar"><strong>Modo:</strong><div class="switch"><button data-mode="training" class="${state.mode==='training'?'on':''}">Treino guiado</button><button data-mode="assessment" class="${state.mode==='assessment'?'on':''}">Avaliação CIC</button></div><select id="catFilter">${cats.map(c=>`<option>${esc(c)}</option>`).join('')}</select><select id="statusFilter"><option value="all">Todos os status</option><option value="review">Revisar</option><option value="mastered">Dominados</option><option value="notstarted">Não iniciados</option></select><button id="resetBtn" class="btn ghost">Zerar progresso</button></div>
 <section id="scenarioGrid" class="grid">${cards('Todos','all')}</section>${footer()}</main>`;
 bindCommon();
 document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;saveState();home();});
 const redraw=()=>document.querySelector('#scenarioGrid').innerHTML=cards(document.querySelector('#catFilter').value,document.querySelector('#statusFilter').value);
 document.querySelector('#catFilter').onchange=redraw; document.querySelector('#statusFilter').onchange=redraw;
 document.querySelector('#scenarioGrid').onclick=e=>{const c=e.target.closest('[data-scenario]'); if(c) startScenario(c.dataset.scenario);};
 document.querySelector('#resetBtn').onclick=()=>{if(confirm('Zerar todo o progresso deste treinamento neste aparelho?')){state=defaultState();saveState();home();}};
}
function cards(cat,status='all'){
 return SCENARIOS.filter(s=>(cat==='Todos'||s.category===cat) && (status==='all'||statusFor(state.completed?.[s.id])===status)).map(s=>{
  const r=state.completed?.[s.id], st=statusFor(r); const statusBadge=st==='mastered'?'<span class="badge mastered">Dominado</span>':st==='review'?'<span class="badge review-needed">Revisar</span>':'<span class="badge">Não iniciado</span>';
  return `<article class="card scenario-card ${r?'done':''} ${st}" data-scenario="${s.id}"><div class="eyebrow">${esc(s.category)}</div><h3>${esc(s.title)}</h3><p>${esc(s.summary)}</p><div class="badges"><span class="badge ${s.difficulty==='Especialista'?'critical':s.difficulty==='Avançado'?'medium':''}">${esc(s.difficulty)}</span><span class="badge">${s.steps.length} decisões</span>${statusBadge}<span class="badge">${esc(s.focus)}</span></div><div class="foot"><span>${r?`${r.score}% · ${r.mastered?'domínio confirmado':'revisão recomendada'}`:'Não iniciado'}</span><span>Iniciar →</span></div></article>`
 }).join('') || '<div class="panel"><b>Nenhum cenário neste filtro.</b></div>';
}

function startScenario(id){
 const s=SCENARIOS.find(x=>x.id===id); if(!s)return;
 current={scenario:s,step:0,answered:false,answers:[],dims:{safety:0,stability:0,procedure:0,coordination:0},maxDims:{safety:0,stability:0,procedure:0,coordination:0},critical:0,lastConsequence:'',lastQuality:'',decisionMargin:100,orders:[]};
 s.steps.forEach((st,idx)=>{st.options.filter(o=>o.quality==='correct').slice(0,1).forEach(o=>Object.keys(current.maxDims).forEach(k=>current.maxDims[k]+=Math.max(0,o.effects[k]||0)));current.orders[idx]=shuffledIndices(st.options.length);});
 renderStage();
}
function dimScore(k){const m=current.maxDims[k]||1;return Math.max(0,Math.min(100,Math.round((current.dims[k]/m)*100)))}
function displayedOptions(st){return current.orders[current.step].map(sourceIdx=>({sourceIdx,o:st.options[sourceIdx]}));}
function currentQualityScore(){return current.answers.length?Math.round(current.answers.reduce((n,a)=>n+qualityPoints(a.quality),0)/current.answers.length):0;}

function renderStage(){
 const s=current.scenario, st=s.steps[current.step], opts=displayedOptions(st); const assessment=state.mode==='assessment';
 const last=current.lastConsequence?`<div class="notice carry ${current.lastQuality==='correct'?'carry-good':current.lastQuality==='partial'?'carry-warn':'carry-bad'}"><b>Condição herdada da decisão anterior:</b> ${esc(current.lastConsequence)}</div>`:'';
 const criticalGate=!assessment&&st.options.some(o=>o.critical)?'<span class="gate">GATE CRÍTICO</span>':'';
 document.querySelector('#app').innerHTML=`<main class="app">${topbar()}<div class="statusline"><button id="backHome" class="btn ghost">← Cenários</button><div class="breadcrumbs">${current.step+1}/${s.steps.length} · ${esc(s.category)} · ${esc(s.difficulty)} ${criticalGate}</div></div>
 <div class="stage-shell"><section class="panel"><div class="eyebrow">${assessment?'Avaliação CIC — sem pistas durante o cenário':esc(s.focus)}</div><h2>${esc(s.title)}</h2><p class="context">${esc(st.context)}</p>${last}<div class="decision"><h3>${esc(st.prompt)}</h3><div id="options" class="options">${opts.map(({sourceIdx,o},i)=>`<button class="option" data-display="${i}" data-source="${sourceIdx}"><b>${String.fromCharCode(65+i)}.</b> ${esc(o.text)}</button>`).join('')}</div><div id="feedback"></div></div><div style="display:flex;justify-content:flex-end;margin-top:14px"><button id="nextBtn" class="btn primary hidden">${current.step===s.steps.length-1?'Ver resultado':'Próxima decisão →'}</button></div></section>
 <aside class="panel side"><h3>Quadro do processo</h3><div class="stategrid">${s.initialState.map(v=>`<div class="statebox"><span>${esc(v[0])}</span><b>${esc(v[1])}<em class="trend ${v[2]}"> ${v[2]==='up'?'▲':v[2]==='down'?'▼':'●'}</em></b></div>`).join('')}</div>${assessment?`<div class="blind-box"><b>Avaliação cega ativa</b><span>Alternativas embaralhadas. Feedback, fonte e desempenho são liberados somente no resultado.</span></div>`:`<h3 style="margin-top:16px">Leitura do desempenho</h3><div class="metrics">${Object.keys(DIM_LABELS).map(k=>`<div class="metric"><span>${DIM_LABELS[k]}</span><b id="m-${k}">${current.answers.length?dimScore(k):'—'}${current.answers.length?'%':''}</b></div>`).join('')}</div><div class="decision-margin"><span>Margem decisória do exercício</span><b id="decisionMargin">${current.decisionMargin}%</b></div><div class="source"><strong>Base:</strong> ${esc(s.source)}<br><br>Modo: <b>Treino guiado</b></div>`}</aside></div>${footer()}</main>`;
 bindCommon(); document.querySelector('#backHome').onclick=home; document.querySelector('#options').onclick=chooseOption; document.querySelector('#nextBtn').onclick=nextStep;
}

function chooseOption(e){
 const b=e.target.closest('[data-source]'); if(!b||current.answered)return; current.answered=true;
 const sourceIdx=+b.dataset.source, displayIdx=+b.dataset.display; const step=current.scenario.steps[current.step], o=step.options[sourceIdx];
 const recommended=step.options.find(x=>x.quality==='correct');
 current.answers.push({step:current.step,sourceIdx,displayIdx,quality:o.quality,text:o.text,feedback:o.feedback,consequence:o.consequence,recommended:recommended?.text||''});
 Object.keys(current.dims).forEach(k=>current.dims[k]+=Math.max(0,o.effects[k]||0));
 if(o.critical&&o.quality!=='correct')current.critical++;
 current.decisionMargin=Math.max(0,current.decisionMargin-(o.quality==='correct'?0:o.quality==='partial'?8:(o.critical?30:18)));
 current.lastConsequence=o.consequence||''; current.lastQuality=o.quality;
 [...document.querySelectorAll('.option')].forEach(el=>{el.disabled=true;if(+el.dataset.source===sourceIdx)el.classList.add('selected',scoreClass(o.quality));});
 if(state.mode==='training'){
   document.querySelector('#feedback').innerHTML=`<div class="feedback ${o.quality==='correct'?'good':o.quality==='partial'?'warn':'bad'}"><b>${qualityLabel(o.quality)}</b>${esc(o.feedback)}<br><small><strong>Resposta do cenário:</strong> ${esc(o.consequence||'')}</small>${o.quality!=='correct'?`<div class="recommended"><b>Ação recomendada:</b> ${esc(recommended?.text||'')}</div>`:''}</div>`;
 } else {
   document.querySelector('#feedback').innerHTML=`<div class="feedback"><b>Decisão registrada.</b>Observe a consequência apresentada na próxima etapa e continue a partir da condição criada.</div>`;
 }
 if(state.mode==='training'){Object.keys(DIM_LABELS).forEach(k=>{const el=document.querySelector('#m-'+k);if(el)el.textContent=dimScore(k)+'%';}); const dm=document.querySelector('#decisionMargin');if(dm)dm.textContent=current.decisionMargin+'%';}
 document.querySelector('#nextBtn').classList.remove('hidden');
}
function nextStep(){if(!current.answered)return;if(current.step<current.scenario.steps.length-1){current.step++;current.answered=false;renderStage();}else finishScenario();}

function finishScenario(){
 const s=current.scenario; const scores=Object.fromEntries(Object.keys(DIM_LABELS).map(k=>[k,dimScore(k)])); const dimAvg=Math.round(Object.values(scores).reduce((a,b)=>a+b,0)/4); const qScore=currentQualityScore(); const raw=Math.round(dimAvg*.7+qScore*.3-current.critical*8); const score=Math.max(0,Math.min(100,raw)); const mastered=masteryRule(score,current.critical,qScore);
 state.completed[s.id]={score,critical:current.critical,qScore,mastered,date:new Date().toISOString(),scores}; state.answers += current.answers.length; state.correct += current.answers.filter(a=>a.quality==='correct').length; state.partial=(state.partial||0)+current.answers.filter(a=>a.quality==='partial').length; state.wrong=(state.wrong||0)+current.answers.filter(a=>a.quality==='wrong').length; saveState();
 const weak=weakestDimension(scores); const level=mastered?'Domínio operacional confirmado':score>=75?'Bom desempenho, mas ainda não dominado':score>=60?'Atenção a pontos de sequência':'Revisão recomendada';
 document.querySelector('#app').innerHTML=`<main class="app">${topbar()}<section class="panel"><div class="eyebrow">Resultado do cenário · ${state.mode==='assessment'?'avaliação CIC':'treino guiado'}</div><h2>${esc(s.title)}</h2><div class="score-big">${score}<small>/100</small></div><h3>${level}</h3>${mastered?`<div class="mastery"><b>✓ Cenário dominado</b><span>Nota ≥82, qualidade decisória ≥75 e nenhuma decisão crítica inadequada.</span></div>`:`<div class="notice"><b>Critério de domínio não atingido.</b> Para dominar: nota ≥82, qualidade decisória ≥75 e zero decisão crítica inadequada.</div>`}${current.critical?`<div class="notice"><b>${current.critical} decisão(ões) crítica(s) inadequada(s)</b> impedem o domínio deste cenário, mesmo com média global elevada.</div>`:''}
 <div class="final-grid">${Object.keys(DIM_LABELS).map(k=>`<div class="metric"><span>${DIM_LABELS[k]}</span><b>${scores[k]}%</b></div>`).join('')}<div class="metric"><span>Qualidade decisória</span><b>${qScore}%</b></div></div>
 <div class="coaching"><b>Prioridade de revisão: ${DIM_LABELS[weak]}</b><span>${esc(coachingFor(weak))}</span><small>Base documental: ${esc(s.source)}</small></div>
 <h3>Revisão comparativa das decisões</h3><div class="review-list">${current.answers.map((a,i)=>`<div class="review ${scoreClass(a.quality)}"><div class="review-head"><b>${i+1}. ${qualityLabel(a.quality)}</b><span>${a.quality==='correct'?'100':a.quality==='partial'?'55':'0'} pts de qualidade</span></div><small><strong>Sua decisão:</strong> ${esc(a.text)}</small>${a.quality!=='correct'?`<small><strong>Ação recomendada:</strong> ${esc(a.recommended)}</small>`:''}<small><strong>Por quê:</strong> ${esc(a.feedback)}</small><small><strong>Consequência:</strong> ${esc(a.consequence||'—')}</small></div>`).join('')}</div>
 <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:16px"><button id="retry" class="btn primary">Refazer com alternativas reembaralhadas</button><button id="goHome" class="btn">Voltar aos cenários</button></div></section>${footer()}</main>`;
 bindCommon(); document.querySelector('#retry').onclick=()=>startScenario(s.id);document.querySelector('#goHome').onclick=home;
}

function bindCommon(){ const ib=document.querySelector('#installBtn'), ub=document.querySelector('#updateBtn'); const installed=window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true; if(ib){ if(installed){ib.textContent='App instalado';ib.disabled=true;} else {ib.classList.remove('hidden');ib.disabled=false;ib.textContent='Instalar App';} ib.onclick=async()=>{if(installed)return;if(deferredPrompt){deferredPrompt.prompt();const choice=await deferredPrompt.userChoice;if(choice&&choice.outcome==='accepted'){deferredPrompt=null;ib.textContent='App instalado';ib.disabled=true;}return;}alert('Se a janela de instalação não abrir, use o menu do navegador (⋮) e escolha “Instalar app” ou “Adicionar à tela inicial”. No Chrome/Android, aguarde alguns segundos após recarregar a página para o navegador validar o PWA.');}; } if(ub)ub.onclick=async()=>{if('serviceWorker'in navigator){const r=await navigator.serviceWorker.getRegistration();if(r){await r.update();alert('Verificação de atualização concluída. Se houver nova versão, feche e reabra o app.');}else alert('Service worker ainda não ativo. Abra novamente a página após a publicação.');}}; }
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredPrompt=e;const b=document.querySelector('#installBtn');if(b)b.classList.remove('hidden');});
window.addEventListener('appinstalled',()=>{deferredPrompt=null;const b=document.querySelector('#installBtn');if(b)b.classList.add('hidden');});
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(console.error));
home();
