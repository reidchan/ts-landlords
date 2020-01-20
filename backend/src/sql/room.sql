CREATE TABLE `room` (
  `id` varchar(36) NOT NULL,
  `code` char(4) NOT NULL COMMENT '房间号',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
   PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COMMENT '房间';