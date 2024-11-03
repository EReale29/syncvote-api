export interface Vote {
  id?: string;
  entityType?: 'post' | 'comment';
  entityId?: string;
  type?: 'up' | 'down';
  createdBy?: string;
}
