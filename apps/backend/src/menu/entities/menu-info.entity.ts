import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity('tbl_menu_info')
export class MenuInfo {
  @PrimaryColumn({ name: 'menu_id', length: 100 })
  menuId: string;

  @Column({ name: 'parent_id', type: 'varchar', length: 100, nullable: true })
  parentId: string | null;

  @Column({ name: 'menu_name', type: 'varchar', length: 100, nullable: true })
  menuName: string | null;

  @Column({ name: 'menu_path', type: 'varchar', length: 255, nullable: true })
  menuPath: string | null;

  @Column({ name: 'menu_icon', type: 'varchar', length: 100, nullable: true })
  menuIcon: string | null;

  @Column({ name: 'menu_type', type: 'varchar', length: 20, nullable: true })
  menuType: string | null;

  @Column({ name: 'menu_role', type: 'varchar', length: 10, nullable: true })
  menuRole: string | null;

  @Column({ name: 'sort_order', type: 'int', nullable: true })
  sortOrder: number | null;

  @Column({ name: 'menu_depth', type: 'int', nullable: true })
  menuDepth: number | null;

  @Column({ name: 'use_yn', type: 'char', length: 1, nullable: true, default: 'Y' })
  useYn: string | null;

  @Column({ name: 'created_date', type: 'date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  createdDate: Date | null;

  @Column({ name: 'created_user', type: 'varchar', length: 100, nullable: true })
  createdUser: string | null;

  @Column({ name: 'modified_date', type: 'date', nullable: true, default: () => 'CURRENT_TIMESTAMP' })
  modifiedDate: Date | null;

  @Column({ name: 'modified_user', type: 'varchar', length: 100, nullable: true })
  modifiedUser: string | null;
}
