import { Column, Model, Table, DataType } from 'sequelize-typescript';
@Table({ tableName: 'customer_changes', timestamps: false })
export class CustomerChange extends Model {
  @Column({ primaryKey: true, type: DataType.STRING(36) }) id: string;
  @Column userHh: string;
  @Column actor: string;
  @Column action: string;
  @Column({ type: DataType.TEXT('long') }) beforeData: string;
  @Column({ type: DataType.TEXT('long') }) afterData: string;
  @Column({ type: DataType.TEXT }) reason: string;
  @Column createdAt: Date;
}
