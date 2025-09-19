import { useState, useEffect } from "react";
import { FileText, Clock, AlertTriangle, CheckCircle, XCircle, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAppStore } from "@/store/app";
import { listDailyLogFeed, FeedItem, getPublicMediaUrl } from "@/lib/db/dailyLogs";
import { MediaLightbox } from "@/components/daily-logs/MediaLightbox";
import { format, parseISO, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentViewProps {
  onCreateClick: () => void;
}

export function DocumentView({ onCreateClick }: DocumentViewProps) {
  const { selectedProject } = useAppStore();
  const [feedItems, setFeedItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [lightboxMedia, setLightboxMedia] = useState<{
    url: string;
    type: 'photo' | 'video';
  } | null>(null);

  useEffect(() => {
    if (selectedProject?.id) {
      loadFeed();
    }
  }, [selectedProject]);

  const loadFeed = async () => {
    if (!selectedProject?.id) return;
    setLoading(true);
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const data = await listDailyLogFeed(selectedProject.id, {
        from: today,
        to: today,
      });
      setFeedItems(data);
    } catch (error) {
      console.error('Error loading feed:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return 'Horário não informado';
    try {
      const date = parseISO(dateString);
      if (isValid(date)) {
        return format(date, 'HH:mm', { locale: ptBR });
      }
    } catch (error) {
      console.warn('Invalid date format:', dateString);
    }
    return 'Horário inválido';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'executed':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'partial':
        return <Clock className="h-4 w-4 text-warning" />;
      case 'not_executed':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case 'medium':
        return <Clock className="h-4 w-4 text-warning" />;
      default:
        return null;
    }
  };

  const groupItemsByTime = (items: FeedItem[]) => {
    return items.sort((a, b) => {
      const timeA = parseISO(a.entry_date || '');
      const timeB = parseISO(b.entry_date || '');
      return timeB.getTime() - timeA.getTime();
    });
  };

  const handleMediaClick = (url: string, type: 'photo' | 'video') => {
    setLightboxMedia({ url: getPublicMediaUrl(url), type });
  };

  if (!selectedProject) {
    return (
      <div className="document-page">
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Nenhum Projeto Selecionado</h3>
          <p className="text-muted-foreground">
            Selecione um projeto na barra lateral para visualizar os logs diários.
          </p>
        </div>
      </div>
    );
  }

  const sortedItems = groupItemsByTime(feedItems);
  const todos = sortedItems.filter(item => item.kind === 'todo' || item.todo_id);
  const logs = sortedItems.filter(item => item.kind === 'note');
  const reports = sortedItems.filter(item => item.kind === 'execution_report');

  return (
    <div className="document-page">
      {/* Document Header */}
      <div className="document-header">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="document-title">Relatório Diário - {selectedProject.name}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                Última atualização: {format(new Date(), 'HH:mm')}
              </div>
            </div>
          </div>
          <Button onClick={onCreateClick} className="print:hidden">
            Nova Entrada
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground">Carregando relatório...</div>
        </div>
      ) : (
        <div className="document-content">
          {/* Executive Summary */}
          <section className="document-section">
            <h2 className="section-title">Resumo Executivo</h2>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  <div>
                    <div className="font-semibold">{logs.length}</div>
                    <div className="text-sm text-muted-foreground">Logs de Atividade</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <div>
                    <div className="font-semibold">{reports.filter(r => r.status === 'executed').length}</div>
                    <div className="text-sm text-muted-foreground">Tarefas Executadas</div>
                  </div>
                </div>
              </Card>
              <Card className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-warning" />
                  <div>
                    <div className="font-semibold">{todos.length}</div>
                    <div className="text-sm text-muted-foreground">Pendências</div>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* To-dos por Prazo */}
          {todos.length > 0 && (
            <section className="document-section">
              <h2 className="section-title">Pendências por Prazo</h2>
              <div className="space-y-3">
                {todos.map((item) => (
                  <div key={item.entry_id} className="timeline-entry">
                    <div className="flex items-start gap-3">
                      <div className="timeline-marker">
                        {getPriorityIcon('high')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{item.todo_title || item.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            Prazo: {item.entry_date ? format(parseISO(item.entry_date), 'dd/MM') : 'Não definido'}
                          </Badge>
                        </div>
                        {item.body && <p className="text-sm text-muted-foreground">{item.body}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Relatórios de Execução */}
          {reports.length > 0 && (
            <section className="document-section">
              <h2 className="section-title">Relatórios de Execução</h2>
              <div className="space-y-4">
                {reports.map((item) => (
                  <div key={item.entry_id} className="execution-report">
                    <div className="flex items-start gap-3">
                      <div className="timeline-marker">
                        {getStatusIcon(item.status || '')}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="timeline-time">{formatTime(item.entry_date || '')}</span>
                          <h4 className="font-medium">{item.todo_title || item.title}</h4>
                          <Badge 
                            variant={item.status === 'executed' ? 'default' : 'destructive'}
                            className="text-xs"
                          >
                            {item.status === 'executed' ? 'Executado' : 
                             item.status === 'partial' ? 'Parcial' : 'Não Executado'}
                          </Badge>
                        </div>
                        
                        {item.reason_label && (
                          <div className="text-sm mb-2">
                            <span className="font-medium">Motivo: </span>
                            <span className="text-muted-foreground">{item.reason_label}</span>
                          </div>
                        )}
                        
                        {item.detail && (
                          <div className="text-sm mb-2">
                            <span className="font-medium">Detalhes: </span>
                            <span className="text-muted-foreground">{item.detail}</span>
                          </div>
                        )}

                        {/* Media Files */}
                        {item.media && item.media.length > 0 && (
                          <div className="media-grid">
                            {item.media.map((media) => (
                              <div
                                key={media.id}
                                className="media-item"
                                onClick={() => handleMediaClick(media.url, media.type)}
                              >
                                {media.type === 'photo' ? (
                                  <img
                                    src={getPublicMediaUrl(media.url)}
                                    alt="Evidência"
                                    className="media-thumbnail"
                                  />
                                ) : (
                                  <video
                                    src={getPublicMediaUrl(media.url)}
                                    className="media-thumbnail"
                                    muted
                                  />
                                )}
                                <div className="media-overlay">
                                  <span className="text-xs">
                                    {media.type === 'photo' ? '📷' : '🎥'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Logs de Atividade */}
          {logs.length > 0 && (
            <section className="document-section">
              <h2 className="section-title">Registro de Atividades</h2>
              <div className="space-y-4">
                {logs.map((item) => (
                  <div key={item.entry_id} className="timeline-entry">
                    <div className="flex items-start gap-3">
                      <div className="timeline-marker">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="timeline-time">{formatTime(item.entry_date || '')}</span>
                          {item.title && <h4 className="font-medium">{item.title}</h4>}
                        </div>
                        {item.body && (
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{item.body}</p>
                        )}
                        
                        {/* Media Files */}
                        {item.media && item.media.length > 0 && (
                          <div className="media-grid mt-3">
                            {item.media.map((media) => (
                              <div
                                key={media.id}
                                className="media-item"
                                onClick={() => handleMediaClick(media.url, media.type)}
                              >
                                {media.type === 'photo' ? (
                                  <img
                                    src={getPublicMediaUrl(media.url)}
                                    alt="Anexo"
                                    className="media-thumbnail"
                                  />
                                ) : (
                                  <video
                                    src={getPublicMediaUrl(media.url)}
                                    className="media-thumbnail"
                                    muted
                                  />
                                )}
                                <div className="media-overlay">
                                  <span className="text-xs">
                                    {media.type === 'photo' ? '📷' : '🎥'}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {sortedItems.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma entrada hoje</h3>
              <p className="text-muted-foreground mb-4">
                Comece criando sua primeira entrada do dia.
              </p>
              <Button onClick={onCreateClick}>
                Nova Entrada
              </Button>
            </div>
          )}
        </div>
      )}

      <MediaLightbox 
        media={lightboxMedia} 
        onClose={() => setLightboxMedia(null)} 
      />
    </div>
  );
}