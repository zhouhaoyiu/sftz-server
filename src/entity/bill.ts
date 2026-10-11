import { Column, DataType, Model, Table } from 'sequelize-typescript';
@Table({ tableName: 'bills', timestamps: false })
export class Bill extends Model {
  @Column({ type: DataType.STRING(36), primaryKey: true }) id: string;
  @Column({ type: DataType.STRING(128), allowNull: false }) userHh: string;
  @Column({ type: DataType.STRING(64), allowNull: false }) requestHash: string;
  @Column({ type: DataType.TEXT('long'), allowNull: false }) snapshot: string;
  @Column({ type: DataType.STRING(128), allowNull: false }) createdBy: string;
  @Column({ type: DataType.DATE, allowNull: false }) createdAt: Date;
}
